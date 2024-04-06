const { clientFactory } = require('../../../database/setupFxns.js');
const jwt = require('jsonwebtoken');
const { CustomValidation } = require('./CustomValidation.js')
const { validateUserRequestAndGetRole, validateRefreshTokenPersistence } = CustomValidation;

async function updateController(req, res, next) {
    const client = clientFactory();
    let clientHasConnected = false;
    let transactionHasBegun = false;
    try {
        await client.connect();
        clientHasConnected = true;
        const role = await validateUserRequestAndGetRole(req.body, client);
        await client.query("BEGIN");
        transactionHasBegun = true;

        const accessToken = jwt.sign(
            {
                "username": req.body.username,
                "role": role
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '5m' }
        );
        const refreshToken = jwt.sign(
            {
                "username": req.body.username
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '10m' }
        );

        const queryObject = {
            text: `UPDATE login SET "refresh_token" = $1 WHERE username = $2 RETURNING *`,
            values: [ refreshToken, req.body.username ]
        };
        let databaseResponse = await client.query(queryObject);
        validateRefreshTokenPersistence(databaseResponse, queryObject, req.body.username);

        await client.query("COMMIT");
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 10 * 1000 });
        res.json({ "response": { accessToken } });
    }
    catch (error) {
        if (transactionHasBegun) {
            await client.query("ROLLBACK");
        }
        next(error);
    }
    finally {
        if (clientHasConnected) {
            await client.end();
        }
    }
}

module.exports = {
    updateController
};