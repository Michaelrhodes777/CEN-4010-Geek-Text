const { clientFactory } = require('../../database/setupFxns.js');
const { SqlQueryFactory } = require('./SqlQueryFactory.js');

function createController(Model) {
    return async function(req, res) {
        const client = clientFactory();
        let results = [];
        let transactionHasBegun = false;
        try {
            await client.connect();
            await client.query("BEGIN");
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
            await client.connect();
            await client.query("BEGIN");
            transactionHasBegun = true;

            const data = req.query.id;
            const queryFactory = new SqlQueryFactory(Model, data, data === "all" ? "read_all" : "read_by_id");
            const queryObject = queryFactory.getSqlObject();
            console.log(queryObject);
            const response = await client.query(queryObject);
            results = data === "all" ? response.rows : response.rows[0];
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

function putController(Model) {
    return async function(req, res) {
        const client = clientFactory();
        let results = [];
        let transactionHasBegun = false;
        try {
            await client.connect();
            await client.query("BEGIN");
            transactionHasBegun = true;

            const data = req.body;
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
            await client.connect();
            await client.query("BEGIN");
            transactionHasBegun = true;

            const data = req.body;
            const queryFactory = new SqlQueryFactory(Model, data, "delete");
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
    putController,
    deleteController
};