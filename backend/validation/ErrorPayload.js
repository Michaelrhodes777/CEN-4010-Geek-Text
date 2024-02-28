class ErrorPayload {

    constructor() {
        this.mainArgs = null;
    }

    appendMainArgs(runtimeObject) {
        this.mainArgs = runtimeObject;
    }

}

module.exports = ErrorPayload;