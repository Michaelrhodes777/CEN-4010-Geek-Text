const { clientFactory } = require('../../../database/setupFxns.js');
const { tablesBodyValidation } = require('../../../validation/database_validation/Composition.js');
const { DEV } = require('../../../config/serverConfig.js');

function createController(Model) {
    return async function(req, res) {
        const client = clientFactory();
        let clientHasConnected = false;
        let transactionHasBegun = false;
        let results;
        try {
            await client.connect();
            clientHasConnected = true;
            await tablesBodyValidation(Model, [ req.body ], client);
            await client.query("BEGIN");
            transactionHasBegun = true;

            const { notNullArray } = Model;
            const values = new Array(notNullArray.length);
            const identifierArray = new Array(notNullArray.length);
            for (let i = 0; i < values.length; i++) {
                values[i] = req.body[notNullArray[i]];
                identifierArray[i] = `$${i + 1}`;
            }
            let queryObject = {
                text: `INSERT INTO ${Model.tableName} ( ${notNullArray.join(", ")} ) VALUES ( ${identifierArray.join(", ")} ) RETURNING *`,
                values: values
            };

            let response = await client.query(queryObject);
            if (!response) {
                throw new Error("response failed");
            }
            results = response.rows[0];

            await client.query("COMMIT");
            if (DEV) {
                res.json({ "response": results });
            }
            else {
                res.status(200).json({ "response": "Registration Successful" });
            }
        }
        catch (error) {
            if (transactionHasBegun) {
                await client.query("ROLLBACK");
            }
            throw error;
        }
        finally {
            if (clientHasConnected) {
                await client.end();
            }
        }
    };
}

module.exports = {
    createController
};