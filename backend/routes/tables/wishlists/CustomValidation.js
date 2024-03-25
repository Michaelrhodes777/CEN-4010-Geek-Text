const { clientFactory } = require('../../../database/setupFxns.js');
const MAX_WISHLISTS = 3;
class MaxNumberOfWishlistsError extends Error {}

async function validateNumberOfWishlists(req, res, next) {
    const client = clientFactory();
    let clientHasConnected = false;
    let transactionHasBegun = false;
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
            console.log(result);
    
            if (result.rows.length !== 0) {
                const { number_of_wishlists } = result?.rows?.[0];
                if (number_of_wishlists > MAX_WISHLISTS) {
                    throw new MaxNumberOfWishlistsError();
                }
            }
        }

        await client.query("COMMIT");
    }
    catch (error) {
        if (transactionHasBegun) {
            await client.query("ROLLBACK");
        }
        console.error(error);
        return res.status(409).json({ "response": "Max wishlists" });
    }
    finally {
        if (clientHasConnected) {
            await client.end();
        }
    }

    next();
}

module.exports = {
    validateNumberOfWishlists
};