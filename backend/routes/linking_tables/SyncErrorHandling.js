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
        SyncValidationLogic.linkingTablesQueryStringValidator(Model, req, new ErrorPayload());
        SyncValidationLogic.linkingTablesDataIterator(Model, {}, req.query, false);
        SyncValidationLogic.customValidations(Model, req);
    }

    static updateControllerSynchronousValidation(Model, req) {
        SyncValidationLogic.linkingTablesQueryStringValidator(Model, req, new ErrorPayload());
        SyncBaseValidations.validateReqBodyStructure(req, new ErrorPayload());
        SyncValidationLogic.linkingTablesDataIterator(Model, req, {"cid": req.query.cid}, false);
        SyncValidationLogic.customValidations(Model, req);
    }

    static deleteControllerSynchronousValidation(Model, req) {
        SyncValidationLogic.linkingTablesQueryStringValidator(Model, req, new ErrorPayload());
        SyncValidationLogic.linkingTablesDataIterator(Model, {}, req.query, false);
        SyncValidationLogic.customValidations(Model, req);
    }
}

module.exports = SyncErrorHandling;