const { clientFactory } = require('../../../database/setupFxns.js');

class DatabaseValidationError extends Error {
    constructor(messageExtension = "") {
        super(`DatabaseValidationError: ${messageExtension}`);
        this.isCustomError = true;
        this.customErrorType = "DatabaseValidationError";
        this.statusCode = 400;
        this.responseMessage = "Malformed Data";
        this.mainArgs = null;
        this.auxArgs = null;
        this.name = null;
        this.iterationIndex = null;
        this.controllerType = null;
        this.loggingPayload = null;
        this.name = null;
    }
}

class RefreshTokenNotFoundError extends DatabaseValidationError {
    static runtimeDataProps = [ "cookies", "jwt", "databaseResponse", "rows" ];

    constructor(errorPayload) {
        super("refresh_token was not found it the database");
        this.name = "RefreshTokenNotFoundError";    
        this.statusCode = 400;
        this.mainArgs = errorPayload;
    }
}

class InvalidUserIdError extends DatabaseValidationError {
    static runtimeErrorProps = [ "cookies", "jwt", "databaseResponse", "rows", "user_id" ];

    constructor(errorPayload) {
        super("user_id was not found in database");
        this.name = "InvalidUserIdError";
        this.statusCode = 400;
        this.mainArgs = errorPayload;
    }
}

class DatabaseFailedToSetRefreshTokenToNullError extends DatabaseValidationError {
    static runtimeDataProps = [ "cookies", "jwt", "databaseResponse", "user_id", "updateResponse" ];

    constructor(errorPayload) {
        super(`database failed to set the refresh_token field to null under user_id ${errorPayload.user_id}`);
        this.name = "DatabaseFailedToSetRefreshTokenToNullError";
        this.statusCode = 500;
        this.mainArgs = errorPayload;
    }
}

async function updateController(req, res) {
    const client = clientFactory();
    let clientHasConnected = false;
    let transactionHasBegun = false;
    let results;
    try {
        await client.connect();
        clientHasConnected = true;
        await client.query("BEGIN");
        transactionHasBegun = true;

        const databaseResponse = await client.query({
            text: `SELECT ( user_id ) FROM logout WHERE refresh_token = $1`,
            values: [ req.cookies.jwt ]
        });

        if (databaseResponse.rows.length === 0) {
            throw new RefreshTokenNotFoundError({
                "cookies": JSON.stringify(req.cookies),
                "jwt": jwt,
                "databaseResponse": JSON.stringify(databaseResponse),
                "rows": JSON.stringify(databaseResponse.rows) 
            });
        }

        const { user_id } = databaseResponse?.rows[0]?.user_id;
        if (!user_id) {
            throw new InvalidUserIdError({
                "cookies": JSON.stringify(req.cookies),
                "jwt": jwt,
                "databaseResponse": JSON.stringify(databaseResponse),
                "rows": JSON.stringify(databaseResponse.rows),
                "user_id": user_id
            });
        }

        const updateResponse = await client.query({
            text: `UPDATE logout SET refresh_token = null WHERE user_id = $1 RETURNING "refresh_token"`,
            values: [ user_id ]
        });
        console.log(updateResponse.rows[0]);
        const refresh_token = updateResponse?.rows?.[0]?.refresh_token;
        if (refresh_token !== null) {
            throw new DatabaseFailedToSetRefreshTokenToNullError({
                "cookies": JSON.stringify(req.cookies),
                "jwt": req.cookies.jwt,
                "databaseResponse": JSON.stringify(databaseResponse),
                "user_id": user_id,
                "updateResponse": JSON.stringify(updateResponse)
            });
        }

        await client.query("COMMIT");
        res.json({ "response": { "refresh_token": refresh_token } });
    }
    catch (error) {
        if (transactionHasBegun) {
            await client.query("ROLLBACK");
        }
        console.error(error);
        res.status(500).json({ "response": error });
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