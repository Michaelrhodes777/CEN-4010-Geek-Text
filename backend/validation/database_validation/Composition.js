const { Logic } = require('./Logic.js');
const {
    validatePrimaryKeyExists,
    validateCompositeKeyExists,
    validateQueryableKeyExists,
    validateCompositeKeyUniqueness,
    validateForeignKeyExists,
    validateUniqueness
} = Logic;
const { ErrorPayload } = require('./Errors.js');

// asynchronousConstraintIdentifiersMap
const ACIM = {
    "foreignKey": "foreignKey",
    "unique": "unique"
};

// asynchronousConstraintIdentifiersArray
const ACIA = [
    ACIM.foreignKey,
    ACIM.unique
];

class Composition {
    static async keyValidation(Model, keyArrays, queryCondition, client) {
        const errorPayload = new ErrorPayload();
        let validationFxn;
        switch (queryCondition) {
            case "id":
                validationFxn = validatePrimaryKeyExists;
                break;
            case "cid":
                validationFxn = validateCompositeKeyExists;
                break;
            case "qid":
                validationFxn = validateQueryableKeyExists;
                break;
        }
        await validationFxn(Model, keyArrays, client, errorPayload);
    }

    static async tablesBodyValidation(Model, dataArray, client) {
        const errorPayload = new ErrorPayload();
        for (let i = 0; i < dataArray.length; i++) {
            const dataObject = dataArray[i];
            errorPayload.iterationIndex = i;
            for (let columnName of Model.columnNamesArray) {
                if (dataObject.hasOwnProperty(columnName)) {
                    for (let ACI of ACIA) {
                        const currentConstraint = Model.asynchronousConstraintSchema[columnName][ACI];
                        if (currentConstraint) {
                            switch (ACI) {
                                case ACIM.unique:
                                    await validateUniqueness(Model, dataObject[columnName], columnName, client, errorPayload);
                                    break;
                                case ACIM.foreignKey:
                                    let queryStringConstructor = () => Model.verifyForeignKeyString(currentConstraint.idName, currentConstraint.tableName);
                                    await validateForeignKeyExists(queryStringConstructor, dataObject[columnName], client, errorPayload);
                                    break;
                                default:
                                    throw new SwitchFallThroughRuntimeError("asynchronousConstraintErrorHandling", { switchArg: ACI, auxiliaryArgs: [currentConstraint, data] });
                            }
                        }
                    }
                }
            }
        }
    }

    static async linkingTablesBodyValidation(Model, dataArray, controllerType, client) {
        if (controllerType === "GET") {
            await validateCompositeKeyUniqueness(Model, dataArray, client);
        }
        await Composition.tablesBodyValidation(Model, dataArray, client);
    }
}

module.exports = Composition;