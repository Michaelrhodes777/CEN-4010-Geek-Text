class ErrorPayload {

    constructor() {
        this.mainArgs = null;
        this.iterationIndex = null;
    }

    appendMainArgs(runtimeObject) {
        this.mainArgs = runtimeObject;
    }

}

module.exports = ErrorPayload;