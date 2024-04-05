const { clientFactory } = require('../../../database/setupFxns.js');
const { CustomValidation } = require('./CustomValidation.js');
const { validateDatabaseRefreshTokenQuery, validateJWTDecoding } = CustomValidation;
const jsonwebtoken = require('jsonwebtoken');

async function readController(req, res) {
    const client = clientFactory();
    let clientHasConnected = false;
    let transactionHasBegun = false;
    try {
        await client.connect();
        clientHasConnected = true;
        await client.query("BEGIN");
        transactionHasBegun = true;

        const { jwt } = req.cookies;
        const queryObject = {
            text: `SELECT * FROM login WHERE refresh_token = $1`,
            values: [ jwt ]
        }
        const databaseResponse = await client.query(queryObject);
        const databaseQueryPayload = {
            jwt,
            queryObject,
            databaseResponse
        };
        validateDatabaseRefreshTokenQuery(databaseQueryPayload);

        let accessToken;
        const { role, username, refresh_token } = databaseResponse.rows[0];
        jsonwebtoken.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decoded) => {
                const decodingPayload = {
                    error,
                    "username": username,
                    "decodedUsername": decoded.username,
                };
                validateJWTDecoding(decodingPayload, databaseQueryPayload);
                accessToken = jsonwebtoken.sign(
                    {
                        "username": decoded.username,
                        "role": role
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "5m" }
                );
            }
        );

        await client.query("COMMIT");
        res.json({ "response": { accessToken } });
    }
    catch (error) {
        console.error(error);
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

module.exports = {
    readController
};