const AsyncValidationLogic = require('../AsyncValidationLogic.js');

class AsyncErrorHandling {
    static async createControllerAsynchronousValidation(Model, idArray, body = null, client) {
        await AsyncValidationLogic.tablesDataIterator(Model, idArray, body, client);
    }

    static async readControllerAsynchronousValidation(Model, idArray, body = null, client) {
        await AsyncValidationLogic.tablesDataIterator(Model, idArray, body, client);
    }

    static async updateControllerAsynchronousValidation(Model, idArray, body = null, client) {
        await AsyncValidationLogic.tablesDataIterator(Model, idArray, body, client);
    }

    static async deleteControllerAsynchronousValidation(Model, idArray, body = null, client) {
        await AsyncValidationLogic.tablesDataIterator(Model, idArray, body, client);
    }
}


module.exports = AsyncErrorHandling;