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

    static tablesQueryStringValidator(req, errorPayload) {
        SyncBaseValidations.validateTablesReqQuery(req, errorPayload);
        SyncBaseValidations.validateStandardQueryString(req.query, errorPayload);
        SyncBaseValidations.validateNoDuplicateIds(req.query.id, errorPayload);
    }

    static linkingTablesQueryStringValidator(Model, req, errorPayload) {
        SyncBaseValidations.validateLinkingTablesReqQuery(req, errorPayload);
        SyncBaseValidations.validateStandardQueryString(req.query, errorPayload);
        if (req.query.hasOwnProperty("cid")) {
            SyncBaseValidations.validateCidQueryString(Model, req.query.cid, errorPayload);
        }
        else {
            SyncBaseValidations.validateNoDuplicateIds(req.query.qid, errorPayload);
        }
    }

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
            let dataObject = hasBody ? JSON.parse(JSON.stringify(req.body[i])) : {};
            if (idArray !== null) {
                dataObject[Model.idName] = idArray[i]
            }
            errorPayload.auxiliaryArgs.indexOfIteration = i;
            if (validateRequiredFields) {
                SyncBaseValidations.validateRequiredReqBodyFields(Model.notNullArray, dataObject, errorPayload);
            }
            SyncValidationLogic.propValidation(Model, dataObject, errorPayload);
        }
    }

    static linkingTablesDataIterator(Model, req, idObjectPayload = null, validateRequiredFields) {
        const hasBody = req.hasOwnProperty("body");
        let propName;
        if (idObjectPayload !== null) {
            propName = Object.keys(idObjectPayload)[0];
        }
        if (idObjectPayload === null && !hasBody) {
            throw new NoIterationArrayInDataIteratorError(new ErrorPayload());
        }
        if (hasBody && idObjectPayload !== null) {
            switch (propName) {
                case "qid":
                    SyncBaseValidations.validateBodyQidMatchingLength(idObjectPayload.qid, req.body, new ErrorPayload());
                    break;
                case "cid":
                    SyncBaseValidations.validateBodyCidMatchingLength(Model, idObjectPayload.cid, req.body, new ErrorPayload());
                    break;
                default:
                    throw new SwitchFallThroughRuntimeError("linkingTablesDataIterator():: matchingidObjectPayloadToBody", { switchArg: propName, auxiliaryArgs: [ idObjectPayload, req.body ] });
            }
        }

        let iterationLength;
        if (hasBody) {
            iterationLength = req.body.length
        }
        else if (propName === "qid") {
            iterationLength = idObjectPayload.qid.length;
        }
        else if (propName === "cid") {
            iterationLength = idObjectPayload.cid.length;
        }
        else {
            throw new SwitchFallThroughRuntimeError("linkingTablesDataIterator():: unable to determine iteration length", { switchArg: propName + String(` hasBody ${hasBody}`), auxiliaryArgs: [ idObjectPayload, req.body ] });           
        }

        let alternateIncrementBoolean = idObjectPayload !== null && propName === "cid" && hasBody;
        let increment = alternateIncrementBoolean ? Model.compositePkeys.length : 1;

        let errorPayload = new ErrorPayload();
        for (let i = 0; i < iterationLength; i += increment) {
            errorPayload.auxiliaryArgs.indexOfIteration = i;

            let dataObject = hasBody ? JSON.parse(JSON.stringify(req.body[i])) : {};
            if (idObjectPayload !== null && propName === "qid") {
                dataObject[Model.queryablePkey] = idObjectPayload.qid[i];
            }
            if (idObjectPayload !== null && propName === "cid" && hasBody) {
                let currentCompositeKeyIndex = 0;
                let numComposites = Model.compositePkeys.length;
                for (let keyName of Model.compositePkeys) {
                    dataObject[keyName] = idObjectPayload.cid[i * numComposites + currentCompositeKeyIndex];
                    currentCompositeKeyIndex++;
                }
            }
            if (alternateIncrementBoolean) {
                let currentCompositeKeyIndex = 0;
                for (let keyName of Model.compositePkeys) {
                    dataObject[keyName] = idObjectPayload.cid[i + currentCompositeKeyIndex];
                    currentCompositeKeyIndex++;
                }
            }
            if (validateRequiredFields) {
                SyncBaseValidations.validateRequiredReqBodyFields(Model.notNullArray, dataObject, errorPayload);
            }
            SyncValidationLogic.propValidation(Model, dataObject, errorPayload);
        }

    }

    static propValidation(Model, dataObject, errorPayload) {
        for (let columnName of Model.columnNamesArray) {
            if (dataObject.hasOwnProperty(columnName)) {
                SyncValidationLogic.validationSwitches(Model.synchronousConstraintSchema[columnName], dataObject[columnName], errorPayload);
            }
        }
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