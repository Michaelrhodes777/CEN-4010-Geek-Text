const { clientFactory } = require('../../../database/setupFxns.js');

class ErrorInterface extends Error {}

class MissingFieldsError extends ErrorInterface {}
class InvalidJSTypeError extends ErrorInterface {}
class RowsDNEError extends ErrorInterface {}
class RowsIsNotLengthOneError extends ErrorInterface {}
class BookIsAlreadyInShoppingCartError extends ErrorInterface {}

async function updateController(req, res) {
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
        res.json({ "response": shoppingCartResult.rows[0] });
    }
    catch (error) {
        if (transactionHasBegun) {
            await client.query("ROLLBACK");
        }
        console.error(error);
        res.status(500).json({ "response": error });
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