const { clientFactory } = require('../../database/setupFxns.js');
const { SqlQueryFactory } = require('../SqlQueryFactory.js');
const { CONDITIONS } = SqlQueryFactory;

function createController(Model) {
    return async function createControllerLogic(req, res) {
        const client = clientFactory();
        let results;
        let transactionHasBegun = false;
        try {
            await client.connect();
            const { body } = req;
            transactionHasBegun = true;

            results = new Array(body.length);
            for (let i = 0; i < results.length; i++) {
                const dataObject = body[i];
                const queryFactory = new SqlQueryFactory(Model, dataObject, null, CONDITIONS.create);
                const queryObject = queryFactory.getSqlQueryObject();
                const response = await client.query(queryObject);
                results[i] = response.rows[0];
            }

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
    }
}


function readController(Model) {
    return async function readControllerLogic(req,res) {
        const client = clientFactory();
        let results;
        let transactionHasBegun = false;
        try {
            await client.connect();
            const { keyArrays } = req;
            transactionHasBegun = true;

            if (keyArrays.length === 1 && keyArrays[0][0] === 0) {
                const queryFactory = new SqlQueryFactory(Model, null, null, CONDITIONS.readAll);
                const queryObject = queryFactory.getSqlQueryObject();
                const response = await client.query(queryObject);
                results = response.rows;
            }
            else {
                results = new Array(keyArrays.length);
                let condition;
                if (req.queryCondition === "cid") {
                    condition = CONDITIONS.readByCid;
                }
                if (req.queryCondition === "qid") {
                    condition = CONDITIONS.readByQid;
                }

                for (let i = 0; i < results.length; i++) {
                    const keyArray = keyArrays[i];
                    const queryFactory = new SqlQueryFactory(Model, null, keyArray, condition);
                    const queryObject = queryFactory.getSqlQueryObject();
                    const response = await client.query(queryObject);
                    results[i] = response.rows;
                }
            }


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
    }
}

function updateController(Model) {
    return async function updateControllerLogic(req, res) {
        const client = clientFactory();
        let results;
        let transactionHasBegun = false;
        try {
            await client.connect();
            const { body, keyArrays } = req;
            transactionHasBegun = true;

            results = new Array(body.length);
            for (let i = 0; i < results.length; i++) {
                const dataObject = body[i];
                const keyArray = keyArrays[i];
                const queryFactory = new SqlQueryFactory(Model, dataObject, keyArray, CONDITIONS.updateByCid);
                const queryObject = queryFactory.getSqlQueryObject();
                const response = await client.query(queryObject);
                results[i] = response.rows[0];
            }

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
    }
}


function deleteController(Model) {
    return async function deleteControllerLogic(req, res) {
        const client = clientFactory();
        let results;
        let transactionHasBegun = false;
        try {
            await client.connect();
            const { keyArrays } = req;
            transactionHasBegun = true;

            let condition;
            if (req.queryCondition === "cid") {
                condition = CONDITIONS.deleteByCid;
            }
            if (req.queryCondition === "qid") {
                condition = CONDITIONS.deleteByQid;
            }
            results = new Array(keyArrays.length);
            for (let i = 0; i < results.length; i++) {
                const keyArray = keyArrays[i];
                const queryFactory = new SqlQueryFactory(Model, null, keyArray, condition);
                const queryObject = queryFactory.getSqlQueryObject();
                const response = await client.query(queryObject);
                results[i] = response.rows[0];
            }

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
    }
}

module.exports = {
    createController,
    readController,
    updateController,
    deleteController
};