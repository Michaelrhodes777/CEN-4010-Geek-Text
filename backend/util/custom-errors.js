class CustomError extends Error {
    constructor(message, errorPayloadObject) {
        super(message);
        const { statusCode, responseMessage, serverErrorMessage } = errorPayloadObject;
        this.statusCode = statusCode;
        this.responseMessage = responseMessage;
        this.serverErrorMessage = serverErrorMessage;
        this.name = this.constructor.name;
    }
}

class InvalidAccessTokenError extends CustomError {
    constructor(message) {
        super(message, {
        statusCode: 401,
        responseMessage: "Invalid access token.",
        serverErrorMessage: "The access token provided is invalid."
        });
    }
}

class ExpiredAccessTokenError extends CustomError {
    constructor(message) {
        super(message, {
        statusCode: 401,
        responseMessage: "Expired access token.",
        serverErrorMessage: "The access token provided has expired."
        });
    }
}
  
module.exports = {
    CustomError,
    InvalidAccessTokenError,
    ExpiredAccessTokenError
};