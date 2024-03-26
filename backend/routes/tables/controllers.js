const { clientFactory } = require('../../database/setupFxns.js');
const { SqlQueryFactory } = require('../SqlQueryFactory.js');
const { CONDITIONS } = SqlQueryFactory;
const { keyValidation, tablesBodyValidation } = require('../../validation/database_validation/Composition.js');

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
            await client.connect();
            await tablesBodyValidation(Model, req.body, client);
            await client.query("BEGIN");
            transactionHasBegun = true;
            const dataArray = req.body;
            results = new Array(req.body.length);
            for (let i = 0; i < results.length; i++) {
                const dataObject = dataArray[i];
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
            //console.error(error);
            if (error.isCustomError) {
                res.status(error.statusCode).json({ "response": error });
            }
            else {
                res.status(500).json({ "response": error });
            }
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
            await client.connect();
            const { keyArrays } = req;
            let allQueryCondition = keyArrays.length === 1 && keyArrays[0][0] === 0;
            if (!allQueryCondition) {
                await keyValidation(Model, keyArrays, req.queryCondition, client);
            }
            await client.query("BEGIN");
            transactionHasBegun = true;

            if (allQueryCondition) {
                const queryFactory = new SqlQueryFactory(Model, null, keyArrays[0], CONDITIONS.readAll);    
                const queryObject = queryFactory.getSqlQueryObject();
                results = (await client.query(queryObject)).rows;
            }
            else {
                results = new Array(keyArrays.length);
                for (let i = 0; i < keyArrays.length; i++) {
                    const keyArray = keyArrays[i];
                    const queryFactory = new SqlQueryFactory(Model, null, keyArray, CONDITIONS.readById);
                    const queryObject = queryFactory.getSqlQueryObject();
                    results[i] = (await client.query(queryObject)).rows[0];
                }
            }

            await client.query("COMMIT");
            res.json({ "response": results });
        }
        catch (error) {
            if (transactionHasBegun) await client.query("ROLLBACK");
            //console.error(error);
            if (error.isCustomError) {
                res.status(error.statusCode).json({ "response": error });
            }
            else {
                res.status(500).json({ "response": error });
            }
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
            await client.connect();
            await keyValidation(Model, req.keyArrays, req.queryCondition, client);
            await tablesBodyValidation(Model, req.body, client);
            await client.query("BEGIN");
            transactionHasBegun = true;
        
            const dataArray = req.body;
            const { keyArrays } = req;
            results = new Array(dataArray.length);
            for (let i = 0; i < results.length; i++) {
                const dataObject = dataArray[i];
                const queryFactory = new SqlQueryFactory(Model, dataObject, keyArrays[i], CONDITIONS.updateById);
                const queryObject = queryFactory.getSqlQueryObject();
                const response = await client.query(queryObject);
                results[i] = response.rows[0];
            }

            await client.query("COMMIT");
            res.json({ "response": results });
        }
        catch (error) {
            if (transactionHasBegun) await client.query("ROLLBACK");
            //console.error(error);
            if (error.isCustomError) {
                res.status(error.statusCode).json({ "response": error });
            }
            else {
                res.status(500).json({ "response": error });
            }
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
            await keyValidation(Model, req.keyArrays, req.queryCondition, client);
            await client.query("BEGIN");
            transactionHasBegun = true;

            const { keyArrays } = req;
            results = new Array(keyArrays.length);
            for (let i = 0; i < results.length; i++) {
                const queryFactory = new SqlQueryFactory(Model, null, keyArrays[i], CONDITIONS.deleteById);
                const queryObject = queryFactory.getSqlQueryObject();
                const response = await client.query(queryObject);
                results[i] = response.rows[0];
            }

            await client.query("COMMIT");
            res.json({ "response": results });
        }
        catch (error) {
            if (transactionHasBegun) await client.query("ROLLBACK");
            //console.error(error);
            if (error.isCustomError) {
                res.status(error.statusCode).json({ "response": error });
            }
            else {
                res.status(500).json({ "response": error });
            }
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