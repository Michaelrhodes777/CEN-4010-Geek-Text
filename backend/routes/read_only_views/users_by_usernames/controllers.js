const { clientFactory } = require('../../../database/setupFxns.js');

async function readController(req, res, next) {
    const client = clientFactory();
    let results;
    let transactionHasBegun = false;
    try {
        await client.connect();
        await client.query("BEGIN");
        transactionHasBegun = true;
        const { usernames: usernamesQueryPayload } = req.query;
        const usernames = usernamesQueryPayload.substring(1, usernamesQueryPayload.length - 1).split(",");
        results = new Array(usernames.length);
        for (let i = 0; i < usernames.length; i++) {
            let response = await client.query({
                text: `SELECT * FROM user_data WHERE username = $1`,
                values: [ usernames[i] ]
            });
            results[i] = response.rows[0];
        }

        res.json({ "response": results });
    }
    catch (error) {
        if (transactionHasBegun) await client.query("ROLLBACK");
        next(error);
    }
    finally {
        await client.end();
    }
}

module.exports = { readController };