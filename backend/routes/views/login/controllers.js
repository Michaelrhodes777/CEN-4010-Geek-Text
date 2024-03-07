const { clientFactory } = require('../../../database/setupFxns.js');
const jwt = require('jwt');
const { CustomValidation } = require('./CustomValidation.js')
const { validateUserRequestAndGetRole } = CustomValidation;

async function updateController(req, res) {
    const client = clientFactory();
    let clientHasConnected = false;
    let transactionHasBegun = false;
    let results;
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
            text: `INSERT INTO login ( "refresh_token" ) VALUES ( $1 ) RETURNING *`,
            values: [ refreshToken ]
        };

        let response = await client.query(queryObject);
        results = response.rows[0];
        results.accessToken = accessToken;

        await client.query("COMMIT");
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 10 * 1000 });
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
}

module.exports = {
    updateController
};