const ErrorPayload = require('../ErrorPayload.js');
const { Logic } = require('./Logic.js');

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

class Composition {
    static bodyIterator(Model, dataArray, errorPayload) {
        for (let i = 0; i < dataArray.length; i++) {
            let dataObject = dataArray[i];
            errorPayload.iterationIndex = i;
            for (let columnName of Model.columnNamesArray) {
                if (dataObject.hasOwnProperty(columnName)) {
                    Composition.validationSwitches(Model.synchronousConstraintSchema[columnName], dataObject[columnName], errorPayload);
                }
            }
        }
    }

    static idArrayIterator(Model, keyArrays, condition = "id", errorPayload) {
        for (let i = 0; i < keyArrays.length; i++) {
            errorPayload.iterationIndex = i;
            let currentKeyArray = keyArrays[i];
            let dataObject = {};
            for (let j = 0; j < currentKeyArray.length; j++) {
                errorPayload.iterationIndex = i;
                if (condition === "id") {
                    dataObject[Model.idName] = currentKeyArray[j];
                }
                else if (condition === "cid") {
                    for (let composites of Model.compositePkeys) {
                        let index = 0;
                        dataObject[composites] = currentKeyArray[index++];
                    }
                }
                else if (condition === "qid") {
                    dataObject[Model.queryablePkey] = currentKeyArray[j];
                }
                else {
                    throw new Error("else condition fall through");
                }
                for (let columnName of Model.columnNamesArray) {
                    if (dataObject.hasOwnProperty(columnName)) {
                        Composition.validationSwitches(Model.synchronousConstraintSchema[columnName], dataObject[columnName], errorPayload);
                    }
                }
            }
        }
    }

    static validationSwitches(synchronousConstraints, data, errorPayload) {
        for (let SCI of SCIA) {
            let currentConstraint = synchronousConstraints[SCI];
            if (currentConstraint != null) {
                switch (SCI) {
                    case SCIM.jsType:
                        Logic.jsTypeValidation(currentConstraint, data, errorPayload);
                        break;
                    case SCIM.dbType:
                        const type = currentConstraint.type;
                        switch (type) {
                            case dbTypesMap.int:
                                Logic.validateIntDbType(currentConstraint.bounds, data, errorPayload);
                                break;
                            case dbTypesMap.varchar:
                                Logic.validateVarcharDbType(currentConstraint.bounds, data, errorPayload);
                                break;
                            default:
                                throw new SwitchFallThroughRuntimeError("dbTypeValidation", { switchArg: type, auxiliaryArgs: [ currentConstraint, data ]});
                        }
                        break;
                    case SCIM.blacklist:
                        Logic.blacklistValidation(currentConstraint, data, errorPayload);
                        break;
                    case SCIM.whitelist:
                        Logic.whitelistValidation(currentConstraint, data, errorPayload);
                        break;
                    case SCIM.requiredList:
                        Logic.requiredListValidation(currentConstraint, data, errorPayload);
                        break;
                    default:
                        throw new SwitchFallThroughRuntimeError("synchronousConstraintErrorHandling", { switchArg: SCI, auxiliaryArgs: [data] });
                }
            }
        }
    }
}

module.exports = Composition;