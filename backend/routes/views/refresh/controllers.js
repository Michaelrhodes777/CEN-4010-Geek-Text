const { clientFactory } = require('../../../database/setupFxns.js');
const jwt = require('jwt');

async function readController(req, res) {
    const client = clientFactory();
    let clientHasConnected = false;
    let transactionHasBegun = false;
    let results;
    try {
        await client.connect();
        clientHasConnected = true;
        await client.query("BEGIN");
        transactionHasBegun = true;

        const { jwt } = req.cookies;
        const databaseResponse = await client.query({
            text: `SELECT ( "role", "refresh_token", "username" ) FROM login WHERE refresh_token = $1`,
            values: [ jwt.substring(7) ]
        });
        if (!databaseResponse) {
            throw Error();
        }

        let accessToken;
        const { role, refresh_token, username } = databaseResponse.rows[0];
        jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decoded) => {
                if (error) {
                    throw new Error();
                }
                if (username !== decoded.username) {
                    throw new Error();
                }
                accessToken = jwt.sign(
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