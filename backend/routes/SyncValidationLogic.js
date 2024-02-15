const ValidationErrors = require('./ValidationErrors.js');
const SyncBaseValidations = require('./SyncBaseValidations.js');
const {
    ErrorPayload,
    NoIterationArrayInDataIteratorError,
    IterationArraysHaveUnequalLengthError,
    SwitchFallThroughRuntimeError
} = ValidationErrors;

// synchronousConstraintIdentifiersMap
const SCIM = {
    "jsType":"jsType",
    "dbType": "dbType",
    "blacklist": "blacklist",
    "whitelist": "whitelist",
    "requiredList": "requiredList",
    "custom": "custom"
};

// synchronousConstraintIdentifiersArray
const SCIA = [
    SCIM.jsType,
    SCIM.dbType,
    SCIM.blacklist,
    SCIM.whitelist,
    SCIM.requiredList,
    SCIM.custom
];

const dbTypesMap = {
    "int": "int",
    "varchar": "varchar"
};

class SyncValidationLogic {

    // if idArray passed, assumes req.query.id conversion to typeof array
    static tablesDataIterator(Model, req, idArray = null, validateRequiredFields) {
        const hasBody = req.hasOwnProperty("body");
        if (idArray === null && !hasBody) {
            throw new NoIterationArrayInDataIteratorError(new ErrorPayload());
        }
        if (idArray !== null && hasBody && idArray.length !== req.body.length) {
            const errorPayload = new ErrorPayload();
            errorPayload.appendMainArgs({
                "idArray": JSON.stringify(idArray),
                "body": JSON.stringify(req.body)
            });
            throw new IterationArraysHaveUnequalLengthError(errorPayload);
        }

        const iterationLength = hasBody ? req.body.length : idArray.length;

        let errorPayload = new ErrorPayload();
        for (let i = 0; i < iterationLength; i++) {
            let dataObject = hasBody ? req.body[i] : {};
            if (idArray !== null) {
                dataObject[Model.idName] = idArray[i]
            }
            errorPayload.auxiliaryArgs.indexOfIteration = i;
            if (validateRequiredFields) {
                SyncBaseValidations.validateRequiredReqBodyFields(Model.notNullArray, dataObject, errorPayload);
            }
            SyncValidationLogic.propValidation(Model, dataObject, errorPayload);
        }

        Model = null;
        req = null;
        idArray = null;
        errorPayload = null;
    }

    static linkingTablesDataIterator(Model, req, idArray = null, validateRequiredFields) {}

    static propValidation(Model, dataObject, errorPayload) {
        for (let columnName of Model.columnNamesArray) {
            if (dataObject.hasOwnProperty(columnName)) {
                SyncValidationLogic.validationSwitches(Model.synchronousConstraintSchema[columnName], dataObject[columnName], errorPayload);
            }
        }
        Model = null;
        dataObject = null;
        errorPayload = null;
    }

    static validationSwitches(synchronousConstraints, data, errorPayload) {
        for (let SCI of SCIA) {
            let currentConstraint = synchronousConstraints[SCI];
            if (currentConstraint != null) {
                switch (SCI) {
                    case SCIM.jsType:
                        SyncBaseValidations.jsTypeValidation(currentConstraint, data, errorPayload);
                        break;
                    case SCIM.dbType:
                        const type = currentConstraint.type;
                        switch (type) {
                            case dbTypesMap.int:
                                SyncBaseValidations.validateIntDbType(currentConstraint.bounds, data, errorPayload);
                                break;
                            case dbTypesMap.varchar:
                                SyncBaseValidations.validateVarcharDbType(currentConstraint.bounds, data, errorPayload);
                                break;
                            default:
                                throw new SwitchFallThroughRuntimeError("dbTypeValidation", { switchArg: type, auxiliaryArgs: [ currentConstraint, data ]});
                        }
                        break;
                    case SCIM.blacklist:
                        SyncBaseValidations.blacklistValidation(currentConstraint, data, errorPayload);
                        break;
                    case SCIM.whitelist:
                        SyncBaseValidations.whitelistValidation(currentConstraint, data, errorPayload);
                        break;
                    case SCIM.requiredList:
                        SyncBaseValidations.requiredListValidation(currentConstraint, data, errorPayload);
                        break;
                    default:
                        throw new SwitchFallThroughRuntimeError("synchronousConstraintErrorHandling", { switchArg: SCI, auxiliaryArgs: [data] });
                }
            }
        }

        synchronousConstraints = null;
        data = null;
        errorPayload = null;
    }

    static customValidations(Model, req) {
        const errorPayload = new ErrorPayload();
        for (let i = 0; i < req.body.length; i++) {
            errorPayload.auxiliaryArgs.indexOfIteration = i;
            for (let columnName of Model.columnNamesArray) {
                const customValidation = Model.synchronousConstraintSchema[columnName].custom;
                if (customValidation === null) {
                    continue;
                }
                if (req.body[i].hasOwnProperty(columnName)) {
                    const { validationLogic } = customValidation;
                    validationLogic(req.body[i][columnName], { "columnName": columnName }, errorPayload);
                }
            }
        }
    }
}

module.exports = SyncValidationLogic;