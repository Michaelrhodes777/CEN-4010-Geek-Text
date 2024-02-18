const { ErrorPayload } = require('../ValidationErrors.js');
const AsyncValidationLogic = require('../AsyncValidationLogic.js');

class AsyncErrorHandling {
    static async createControllerAsynchronousValidation(Model, req, client) {
        await AsyncValidationLogic.createRouteBodyCompositeKeysValidator(Model, req, client, new ErrorPayload());
        await AsyncValidationLogic.tablesDataIterator(Model, null, req.body, client);
    }

    static async readControllerAsynchronousValidation(Model, req, client) {
        await AsyncValidationLogic.linkingTablesQueryStringValidator(Model, req, client, new ErrorPayload());
        await AsyncValidationLogic.linkingTablesDataIterator(Model, req.query, req.body, client);
    }

    static async updateControllerAsynchronousValidation(Model, req, client) {
        await AsyncValidationLogic.linkingTablesQueryStringValidator(Model, req, client, new ErrorPayload());
        await AsyncValidationLogic.linkingTablesDataIterator(Model, req.query, req.body, client);
    }

    static async deleteControllerAsynchronousValidation(Model, req, client) {
        await AsyncValidationLogic.linkingTablesQueryStringValidator(Model, req, client, new ErrorPayload());
        await AsyncValidationLogic.linkingTablesDataIterator(Model, req.query, req.body, client);
    }
}


module.exports = AsyncErrorHandling;