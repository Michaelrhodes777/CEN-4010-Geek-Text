const { clientFactory } = require('../../../database/setupFxns.js');
const { CustomValidation } = require('./CustomValidation.js');
const { validateDatabaseResponse, validateRefreshTokenUpdate } = CustomValidation;

async function updateController(req, res, next) {
    const client = clientFactory();
    let clientHasConnected = false;
    let transactionHasBegun = false;
    try {
        await client.connect();
        clientHasConnected = true;
        await client.query("BEGIN");
        transactionHasBegun = true;

        let databaseQueryObject = {
            text: `SELECT ( user_id ) FROM logout WHERE refresh_token = $1`,
            values: [ req.cookies.jwt ]
        };
        const databaseResponse = await client.query(databaseQueryObject);
        const databaseQueryPayload = { databaseQueryObject, databaseResponse };
        validateDatabaseResponse(req, databaseQueryPayload);


        const { user_id } = databaseResponse.rows[0];
        const updateQueryObject = {
            text: `UPDATE logout SET refresh_token = null WHERE user_id = $1 RETURNING "refresh_token"`,
            values: [ user_id ]
        };
        const updateResponse = await client.query(updateQueryObject);
        const updateQueryPayload = { updateQueryObject, updateResponse };
        validateRefreshTokenUpdate(req, databaseQueryPayload, updateQueryPayload);
        const { refresh_token } = updateResponse.rows[0];

        await client.query("COMMIT");
        res.json({ "response": { "refresh_token": refresh_token } });
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