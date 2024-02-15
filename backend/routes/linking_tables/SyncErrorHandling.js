const SyncBaseValidations = require('../SyncBaseValidations.js');
const SyncValidationLogic = require('../SyncValidationLogic.js');
const { ErrorPayload } = require('../ValidationErrors.js');

class SyncErrorHandling {
    static createControllerSynchronousValidation(Model, req) {
        SyncBaseValidations.validateReqBodyStructure(req, new ErrorPayload());
        SyncValidationLogic.linkingTablesDataIterator(Model, req, null, true);
        SyncValidationLogic.customValidations(Model, req);
    }

    static readControllerSynchronousValidation(Model, req) {
        SyncBaseValidations.validateLinkingTableQueryString(req, new ErrorPayload());
        SyncValidationLogic.linkingTablesDataIterator(Model, {}, JSON.parse(req.query.id), false);
        SyncValidationLogic.customValidations(Model, req);
    }

    static updateControllerSynchronousValidation(Model, req) {
        SyncBaseValidations.validateLinkingTableQueryString(req, new ErrorPayload());
        SyncBaseValidations.validateReqBodyStructure(req, new ErrorPayload());
        SyncValidationLogic.linkingTablesDataIterator(Model, req, JSON.parse(req.query.id), false);
        SyncValidationLogic.customValidations(Model, req);
    }

    static deleteControllerSynchronousValidation(Model, req) {
        SyncBaseValidations.validateLinkingTableQueryString(req, new ErrorPayload());
        SyncValidationLogic.linkingTablesDataIterator(Model, {}, JSON.parse(req.query.id), false);
        SyncValidationLogic.customValidations(Model, req);
    }
}

module.exports = SyncErrorHandling;