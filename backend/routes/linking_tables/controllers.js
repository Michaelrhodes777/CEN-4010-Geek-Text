const { clientFactory } = require('../../database/setupFxns.js');
const { SqlQueryFactory } = require('./SqlQueryFactory.js');

async function createControllerLogic(Model, req) {
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
            const queryFactory = new SqlQueryFactory(Model, { "columnData": dataObject, "keyArray": null }, "create");
            const queryObject = queryFactory.getSqlObject();
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

async function readCidControllerLogic(Model, req) {
    const client = clientFactory();
    let results;
    let transactionHasBegun = false;
    try {
        await client.connect();
        const { keyArrays } = req;
        transactionHasBegun = true;

        results = new Array(keyArrays.length);
        for (let i = 0; i < results.length; i++) {
            const keyArray = keyArrays[i];
            const queryFactory = new SqlQueryFactory(Model, { "columnData": null, "keyArray": keyArray }, "readCid");
            const queryObject = queryFactory.getSqlObject();
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

async function readQidControllerLogic(Model, req) {
    const client = clientFactory();
    let results;
    let transactionHasBegun = false;
    try {
        await client.connect();
        const { keyArrays } = req;
        transactionHasBegun = true;

        results = new Array(keyArrays.length);
        for (let i = 0; i < results.length; i++) {
            const keyArray = keyArrays[i];
            const queryFactory = new SqlQueryFactory(Model, { "columnData": null, "keyArray": keyArray }, "readQid");
            const queryObject = queryFactory.getSqlObject();
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

async function updateControllerLogic(Model, req) {
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
            const queryFactory = new SqlQueryFactory(Model, { "columnData": dataObject, "keyArray": keyArray }, "update");
            const queryObject = queryFactory.getSqlObject();
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

async function deleteCidControllerLogic(Model, req) {
    const client = clientFactory();
    let results;
    let transactionHasBegun = false;
    try {
        await client.connect();
        const { keyArrays } = req;
        transactionHasBegun = true;

        results = new Array(keyArrays.length);
        for (let i = 0; i < results.length; i++) {
            const keyArray = keyArrays[i];
            const queryFactory = new SqlQueryFactory(Model, { "columnData": null, "keyArray": keyArray }, "deleteCid");
            const queryObject = queryFactory.getSqlObject();
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

async function deleteQidControllerLogic(Model, req) {
    const client = clientFactory();
    let results;
    let transactionHasBegun = false;
    try {
        await client.connect();
        const { keyArrays } = req;
        transactionHasBegun = true;

        results = new Array(keyArrays.length);
        for (let i = 0; i < results.length; i++) {
            const keyArray = keyArrays[i];
            const queryFactory = new SqlQueryFactory(Model, { "columnData": null, "keyArray": keyArray }, "deleteQid");
            const queryObject = queryFactory.getSqlObject();
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

function createController(Model) {
    return async (req, res) => await createControllerLogic(Model, req);
}

function readController(Model) {
    return async (req, res) => {
        const { queryCondition } = req;
        if (queryCondition === "cid") {
            await readCidControllerLogic(Model, req);
        }
        if (queryCondition === "qid") {
            await readQidControllerLogic(Model, req);
        }
    };
}

function updateController(Model) {
    return async (req, res) => await updateControllerLogic(Model, req);
}

function deleteController() {
    return async (req, res) => {
        const { queryCondition } = req;
        if (queryCondition === "cid") {
            await deleteCidControllerLogic(Model, req);
        }
        if (queryCondition === "qid") {
            await deleteQidControllerLogic(Model, req);
        }
    };
}

module.exports = {
    createController,
    readController,
    updateController,
    deleteController
};