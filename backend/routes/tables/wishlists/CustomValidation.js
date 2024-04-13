const { clientFactory } = require('../../../database/setupFxns.js');
const MAX_WISHLISTS = 3;
class MaxNumberOfWishlistsError extends Error {
    constructor(number, user_id_fkey) {
        super(`Max wishlists ${number} exists under user ${user_id_fkey}`);
        this.isCustomError = true;
        this.statusCode = 409;
        this.responseMessage = "Max wishlists";
    }
}

async function validateNumberOfWishlists(req, res, next) {
    const client = clientFactory();
    let clientHasConnected = false;
    let transactionHasBegun = false;
    let errorRef;
    try {
        await client.connect();
        clientHasConnected = true;
        await client.query("BEGIN");
        transactionHasBegun = true;
        
        for (let dataObject of req.body) {
            const { user_id_fkey } = dataObject;
            const queryObject = {
                text: "SELECT * FROM users_quantity_of_wishlists WHERE user_id_fkey = $1",
                values: [ user_id_fkey ]
            };
    
            const result = await client.query(queryObject);
    
            if (result.rows.length !== 0) {
                const { number_of_wishlists } = result?.rows?.[0];
                if (number_of_wishlists >= MAX_WISHLISTS) {
                    throw new MaxNumberOfWishlistsError(number_of_wishlists, user_id_fkey);
                }
            }
        }

        await client.query("COMMIT");
    }
    catch (error) {
        if (transactionHasBegun) {
            await client.query("ROLLBACK");
        }
        errorRef = error;
    }
    finally {
        if (clientHasConnected) {
            await client.end();
        }
        if (errorRef) {
            if (errorRef.statusCode) {
                console.log("git");
                return res.status(errorRef.statusCode).json({ "response": errorRef.responseMessage });
            }
            else {
                console.log("hit");
                next(errorRef);
            }
        }
        else {
            next();
        }
    }
}

module.exports = {
    validateNumberOfWishlists
};