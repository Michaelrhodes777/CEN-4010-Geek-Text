const { clientFactory } = require('../../database/setupFxns.js');
const { SqlQueryFactory } = require('./SqlQueryFactory.js');
const SynchronousErrorHandling = require('./SynchronousErrorHandling.js');
const { validateQueryString, validateRequiredReqBodyFields, validateSynchronousRequestData } = SynchronousErrorHandling;
const AsynchronousErrorHandling = require('./AsynchronousErrorHandling.js');
const { validateAsynchronousRequestData } = AsynchronousErrorHandling;

function createController(Model) {
    return async function(req, res) {
        const client = clientFactory();
        let results = [];
        let transactionHasBegun = false;
        try {
            validateRequiredReqBodyFields(Model.notNullArray, req.body);
            validateSynchronousRequestData(Model, req.body);

            await client.connect();
            await client.query("BEGIN");
            await validateAsynchronousRequestData(Model, req.body, client);
            transactionHasBegun = true;

            const data = req.body;
            const queryFactory = new SqlQueryFactory(Model, data, "create");
            const queryObject = queryFactory.getSqlObject();
            const response = await client.query(queryObject);
            results = response.rows[0];

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

function readController(Model) {
    return async function(req, res) {
        const client = clientFactory();
        let results = [];
        let transactionHasBegun = false;
        try {
            validateQueryString(Model.queryStringRequirements.r, req.query);
            validateSynchronousRequestData(Model, { [Model.idName]: parseInt(req.query.id) });

            await client.connect();
            await client.query("BEGIN");
            if (req.query.id != 0) {
                const requestDataPackaging = {
                    [Model.idName]: parseInt(req.query.id)
                };
                await validateAsynchronousRequestData(Model, requestDataPackaging, client);
            }
            transactionHasBegun = true;

            const data = req.query.id;
            const queryFactory = new SqlQueryFactory(Model, data, data == 0 ? "read_all" : "read_by_id");
            const queryObject = queryFactory.getSqlObject();
            console.log(queryObject);
            const response = await client.query(queryObject);
            results = data == 0 ? response.rows : response.rows[0];
            console.log(results);

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

function updateController(Model) {
    return async function(req, res) {
        const client = clientFactory();
        let results = [];
        let transactionHasBegun = false;
        try {
            validateQueryString(Model.queryStringRequirements.u, req.query);
            const reqBody = {
                [Model.idName]: parseInt(req.query.id),
                ...req.body
            };
            validateSynchronousRequestData(Model, reqBody);

            await client.connect();
            await client.query("BEGIN");
            await validateAsynchronousRequestData(Model, reqBody, client);
            transactionHasBegun = true;

            const data = reqBody;
            const queryFactory = new SqlQueryFactory(Model, data, "put");
            const queryObject = queryFactory.getSqlObject();
            const response = await client.query(queryObject);
            results = response.rows[0];

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

function deleteController(Model) {
    return async function(req, res) {
        const client = clientFactory();
        let results;
        let transactionHasBegun = false;
        try {
            validateQueryString(Model.queryStringRequirements.d, req.query);

            await client.connect();
            await client.query("BEGIN");
            const requestDataPackaging = {
                [Model.idName]: parseInt(req.query.id)
            };
            await validateAsynchronousRequestData(Model, requestDataPackaging, client);
            transactionHasBegun = true;

            const queryFactory = new SqlQueryFactory(Model, { [Model.idName]: req.query.id }, "delete");
            const queryObject = queryFactory.getSqlObject();
            const response = await client.query(queryObject);
            results = response.rows[0];

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

module.exports = {
    createController,
    readController,
    updateController,
    deleteController
};