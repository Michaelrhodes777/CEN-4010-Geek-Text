const { clientFactory } = require('../../database/setupFxns.js');
const { SqlQueryFactory } = require('./SqlQueryFactory.js');
const { SyncCompositions } = require('./SynchronousErrorHandling.js');
const { 
    createControllerSynchronousValidation,
    readControllerSynchronousValidation,
    updateControllerSynchronousValidation,
    deleteControllerSynchronousValidation
} = SyncCompositions;
const { AsyncCompositions } = require('./AsynchronousErrorHandling.js');
const {
    createControllerAsynchronousValidation,
    readControllerAsynchronousValidation,
    updateControllerAsynchronousValidation,
    deleteControllerAsynchronousValidation
} = AsyncCompositions;

function reqMapper(req) {
    return JSON.parse(JSON.stringify({
        app: req.app,
        body: req.body,
        cookies: req.cookies,
        fresh: req.fresh,
        hostname: req.hostname,
        ip: req.ip,
        ips: req.ips,
        method: req.method,
        originalUrl: req.originalUrl,
        params: req.params,
        path: req.path,
        protocol: req.protocol,
        query: req.query,
        route: req.route,
        secure: req.secure,
        signedCookies: req.signedCookies,
        stale: req.stale,
        subdomains: req.subdomains,
        xhr: req.xhr
    }));
}

function createController(Model) {
    return async function(req, res) {
        const client = clientFactory();
        let results;
        let transactionHasBegun = false;
        try {
            createControllerSynchronousValidation(Model, req);

            await client.connect();
            await createControllerAsynchronousValidation(Model, null, req.body, client);
            transactionHasBegun = true;

            const dataArray = req.body;
            results = new Array(req.body.length);
            for (let i = 0; i < results.length; i++) {
                const dataObject = dataArray[i];
                const queryFactory = new SqlQueryFactory(Model, dataObject, "create");
                const queryObject = queryFactory.getSqlObject();
                const response = await client.query(queryObject);
                results[i] = response.rows[0];
            }

            await client.query("COMMIT");
            res.json({ "response": results });
        }
        catch (error) {
            if (transactionHasBegun) await client.query("ROLLBACK");
            //error.req = reqMapper(req);
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
        let results;
        let transactionHasBegun = false;
        try {
            readControllerSynchronousValidation(Model, req);

            await client.connect();
            await client.query("BEGIN");
            transactionHasBegun = true;

            const parsedIdArray = JSON.parse(req.query.id);

            if (parsedIdArray[0] === 0) {
                const queryFactory = new SqlQueryFactory(Model, parsedIdArray[0], "read_all");    
                const queryObject = queryFactory.getSqlObject();
                results = (await client.query(queryObject)).rows;
            }
            else {
                await readControllerAsynchronousValidation(Model, parsedIdArray, null, client);
                results = new Array(parsedIdArray.length);
                for (let i = 0; i < parsedIdArray.length; i++) {
                    const id = parsedIdArray[i];
                    const queryFactory = new SqlQueryFactory(Model, id, "read_by_id");
                    const queryObject = queryFactory.getSqlObject();
                    results[i] = (await client.query(queryObject)).rows[0];
                }
            }

            await client.query("COMMIT");
            res.json({ "response": results });
        }
        catch (error) {
            if (transactionHasBegun) await client.query("ROLLBACK");
            //error.req = reqMapper(req);
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
        let results;
        let transactionHasBegun = false;
        try {
            updateControllerSynchronousValidation(Model, req);

            await client.connect();
            await client.query("BEGIN");
            transactionHasBegun = true;

            const parsedIdArray = JSON.parse(req.query.id);
            await updateControllerAsynchronousValidation(Model, parsedIdArray, req.body, client);

            const dataArray = req.body;
            results = new Array(req.body.length);
            for (let i = 0; i < results.length; i++) {
                const dataObject = dataArray[i];
                dataObject[Model.idName] = parsedIdArray[i];
                const queryFactory = new SqlQueryFactory(Model, dataObject, "put");
                const queryObject = queryFactory.getSqlObject();
                const response = await client.query(queryObject);
                results[i] = response.rows[0];
            }

            await client.query("COMMIT");
            res.json({ "response": results });
        }
        catch (error) {
            if (transactionHasBegun) await client.query("ROLLBACK");
            //error.req = reqMapper(req);
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
            deleteControllerSynchronousValidation(Model, req);

            await client.connect();
            await client.query("BEGIN");
            transactionHasBegun = true;

            const parsedIdArray = JSON.parse(req.query.id);
            await deleteControllerAsynchronousValidation(Model, parsedIdArray, null, client);

            results = new Array(parsedIdArray.length);
            for (let i = 0; i < results.length; i++) {
                const id = parsedIdArray[i];
                const queryFactory = new SqlQueryFactory(Model, {[Model.idName]: id}, "delete");
                const queryObject = queryFactory.getSqlObject();
                const response = await client.query(queryObject);
                results[i] = response.rows[0];
            }

            await client.query("COMMIT");
            res.json({ "response": results });
        }
        catch (error) {
            if (transactionHasBegun) await client.query("ROLLBACK");
            //error.req = reqMapper(req);
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