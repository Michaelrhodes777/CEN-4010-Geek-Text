const { clientFactory } = require('../../../database/setupFxns.js');

async function getByMinRating(req, res) {
    const client = clientFactory();
    let results = [];
    let transactionHasBegun = false;
    try {
        await client.connect();
        await client.query("BEGIN");
        transactionHasBegun = true;

        const queryObject = {
            text: `SELECT * FROM average_book_ratings WHERE average_rating >= $1`,
            values: [ req.params.average_rating ]
        };

        const response = await client.query(queryObject);
        results = response.rows;

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

module.exports = {
    getByMinRating
};