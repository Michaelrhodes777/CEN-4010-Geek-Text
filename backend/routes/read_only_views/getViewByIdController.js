const { clientFactory } = require('../../database/setupFxns.js');

function cleanRowData(databaseResponse, isSingleRow) {
    if (isSingleRow) {
        return databaseResponse.rows[0];
    }
    else {
        return databaseResponse.rows;
    }
}

function getViewByIdController(tableName, options = { "hasParams": true, "isSingleRow": true}) {
    return async function(req, res) {
        const client = clientFactory();
        let results = [];
        let transactionHasBegun = false;
        try {
            await client.connect();
            await client.query("BEGIN");
            transactionHasBegun = true;

            const queryObject = {
                text: `SELECT * FROM ${tableName}`
            };

            if (options.hasParams) {
                const param_name = Object.keys(req.params)[0];
                const data = req.params[param_name];
                queryObject.text = queryObject.text + ` WHERE ${param_name} = $1`,
                queryObject.values = [ data ];
            }

            const response = await client.query(queryObject);
            results = cleanRowData(response, options.isSingleRow);

            await client.query("COMMIT");
            res.json({ "response": results });
        }
        catch (error) {
            if (transactionHasBegun) await client.query("ROLLBACK");
            console.error(error);
            res.status(500).json({ "response": error });
        }
        finally {
            await client.end();
        }
    };
}

module.exports = getViewByIdController;