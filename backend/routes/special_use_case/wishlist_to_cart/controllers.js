const { clientFactory } = require('../../../database/setupFxns.js');
const { DEV } = require('../../../config/serverConfig.js');

class ErrorInterface extends Error {
    static thisProps = [
        "isCustomError",
        "statusCode",
        "responseMessage",
        "mainArgs",
        "auxArgs",
        "iterationIndex",
        "controllerType",
        "loggingPayload",
        "name"
    ];

    constructor(messageExtension = "", errorPayload) {
        super(`LoginError: ${messageExtension}`);
        this.isCustomError = true;
        this.customErrorType = "WishlistToCartController";
        this.statusCode = 400;
        this.responseMessage = "Malformed Data";
        this.mainArgs = errorPayload;
        this.auxArgs = null;
        this.name = null;
        this.iterationIndex = null;
        this.controllerType = "PUT";
        this.loggingPayload = null;
        this.name = null;
    }
}

class MissingFieldsError extends ErrorInterface {
    static runtimeDataProps = [ "book_id", "wishlist_id" ];

    constructor(errorPayload) {
        super(`Required data missing from body`, errorPayload);
        this.name = "MissingFieldsErrors";
    }
}
class InvalidJSTypeError extends ErrorInterface {
    static runtimeDataProps = [ "book_id", "wishlist_id" ];

    constructor(errorPayload) {
        super(`Required data is not correct type`, errorPayload);
        this.name = "InvalidJSTypeError";
    }
}
class RowsDNEError extends ErrorInterface {
    static runtimeDataProps = [];

    constructor(errorPayload) {
        super(`Failed to retrieve rows from database`, errorPayload);
        this.name = "RowsDNEError";
    }
}
class RowsIsNotLengthOneError extends ErrorInterface {
    static runtimeDataProps = [];

    constructor(errorPayload) {
        super(`Rows does not contain only one element`, errorPayload);
        this.name = "RowsIsNotLengthOneError";
    }
}
class BookIsAlreadyInShoppingCartError extends ErrorInterface {
    static runtimeDataProps = [];

    constructor(errorPayload) {
        super(`Books is already in the shopping cart`, errorPayload);
        this.name = "BookIsAlreadyInShoppingCartError";
    }
}

async function updateController(req, res, next) {
    const client = clientFactory();
    let clientHasConnected = false;
    let transactionHasBegun = false;
    try {
        await client.connect();
        clientHasConnected = true;
        await client.query("BEGIN");
        transactionHasBegun = true;
        const { book_id, wishlist_id } = req.body;
        if (!book_id || !wishlist_id) {
            throw new MissingFieldsError({ 
                "book_id": book_id, 
                "wishlist_id": wishlist_id
            });
        }
        if (typeof book_id !== "number" || typeof wishlist_id !== "number") {
            throw new InvalidJSTypeError({
                "book_id": book_id, 
                "wishlist_id": wishlist_id
            });
        }

        const deletionQueryObject = {
            text: `DELETE FROM "books_wishlists_lt" WHERE book_id_fkey = $1 AND wishlist_id_fkey = $2 RETURNING *`,
            values: [ book_id, wishlist_id ]
        };
        
        const deletionResult = await client.query(deletionQueryObject);
        let { rows: deletionRows } = deletionResult;
        if (!deletionRows) {
            throw new RowsDNEError({ "deletionRows": JSON.stringify(deletionRows) });
        }
        if (deletionRows.length != 1) {
            throw new RowsIsNotLengthOneError({ "deletionRows": JSON.stringify(deletionRows) });
        }

        const userIdQuery = {
            text: `SELECT ( user_id_fkey ) FROM wishlists WHERE wishlist_id = $1`,
            values: [ wishlist_id ]
        };
        const userIdQueryResult = await client.query(userIdQuery);
        let { rows: userIdRows } = userIdQueryResult;
        if (!userIdRows) {
            throw new RowsDNEError({ "userIdRows": JSON.stringify(userIdRows) });
        }
        if (userIdRows.length != 1) {
            throw new RowsIsNotLengthOneError({ "userIdRows": JSON.stringify(userIdRows) });
        }
        const { user_id_fkey } = userIdQueryResult.rows[0];

        const shoppingCartValidationQuery = {
            text: "SELECT * FROM shopping_carts_lt WHERE user_id_fkey = $1 and book_id_fkey = $2",
            values: [ user_id_fkey, book_id ]
        };

        const shoppingCartValidationResult = await client.query(shoppingCartValidationQuery);
        if (shoppingCartValidationResult.rows.length !== 0) {
            throw new BookIsAlreadyInShoppingCartError();
        }

        const shoppingCartQuery = {
            text: `INSERT INTO shopping_carts_lt ( user_id_fkey, book_id_fkey, quantity ) VALUES ( $1, $2, $3) RETURNING *`,
            values: [ user_id_fkey, book_id, 1 ]
        };

        const shoppingCartResult = await client.query(shoppingCartQuery);

        await client.query("COMMIT");
        if (DEV) {
            res.json({ "response": shoppingCartResult.rows[0] });
        }
        else {
            res.sendStatus(200);
        }
    }
    catch (error) {
        if (transactionHasBegun) {
            await client.query("ROLLBACK");
        }
        next(error);
    }
    finally {
        if (clientHasConnected) {
            await client.end();
        }
    }
}

module.exports = {
    updateController
};