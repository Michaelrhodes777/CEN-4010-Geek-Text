const { clientFactory } = require('../../../database/setupFxns.js');
const { tablesBodyValidation } = require('../../../validation/database_validation/Composition.js');

function updateController(Model) {
    return async function(req, res) {
        const client = clientFactory();
        let clientHasConnected = false;
        let transactionHasBegun = false;
        let results;
        try {
            await client.connect();
            clientHasConnected = true;
            const { username } = req.query;
            const usernameResponse = await client.query({
                text: `SELECT ( "username" ) FROM ${Model.tableName} WHERE ${Model.keyName} = $1`,
                values: [ username ]
            });
            if (!usernameResponse?.rows?.[0]?.length !== 1) {
                throw new Error("No username");
            }

            await tablesBodyValidation(Model, req.body, client);
            await client.query("BEGIN");
            transactionHasBegun = true;

            let setStringBuild = [];
            let values = [];
            let index = 1;
            for (let columnName of Model.columnNamesArray) {
                if (req.body.hasOwnProperty(columnName)) {
                    setStringBuild.push(`${columnName} = $${index++}`);
                    values.push(req.body[columnName]);
                }
            }

            values.push(username);
            let queryObject = {
                text: `UPDATE ${Model.tablename} SET ${setStringBuild.join(", ")} WHERE ${Model.keyName} = ${index} RETURNING *`,
                values: values
            };

            let response = await client.query(queryObject);
            results = response.rows[0];

            await client.query("COMMIT");
            res.json({ "response": results });
        }
        catch (error) {
            if (transactionHasBegun) {
                await client.query("ROLLBACK");
            }
            if (error.isCustomError) {
                res.status(error.statusCode).json({ "response": error });
            }
            else {
                res.status(500).json({ "response": error });
            }
        }
        finally {
            if (clientHasConnected) {
                await client.end();
            }
        }
    };
}

module.exports = {
    updateController
};