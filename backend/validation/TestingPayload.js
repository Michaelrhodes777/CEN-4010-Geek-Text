const ErrorPayload = require('./ErrorPayload.js');

class TestingPayload {
    
    constructor(testName, fxnName, args) {
        this.testName = testName;
        this.fxnName = fxnName;
        this.args = args;
        this.errorPayload = new ErrorPayload();
    }

    runTest(LogicFunctionsMap) {
        const { fxnName, args, errorPayload } = this;
        LogicFunctionsMap[fxnName](...args, errorPayload);
    }
}

module.exports = TestingPayload;