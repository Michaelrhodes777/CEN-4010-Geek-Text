const ValidationErrors = require('./ValidationErrors.js');
const AsyncBaseValidations = require('./AsyncBaseValidations.js');
const {
    ErrorPayload,
    NoIterationArrayInDataIteratorError,
    IdArrayHasZeroLengthError,
    AllQueryAndBodyError,
    SwitchFallThroughRuntimeError
} = ValidationErrors;
const { parseStringifiedArray } = require('../util/utilFxns.js');

// asynchronousConstraintIdentifiersMap
const ACIM = {
    "primaryKey": "primaryKey",
    "foreignKey": "foreignKey",
    "unique": "unique"
};

// asynchronousConstraintIdentifiersArray
const ACIA = [
    ACIM.primaryKey,
    ACIM.foreignKey,
    ACIM.unique
];

class AsyncValidationLogic {

    static async tablesQueryStringValidator() {}

    static async linkingTablesQueryStringValidator(Model, req, client, errorPayload) {
        const queryProps = Object.keys(req.query);

        if (queryProps.length !== 1) {
            errorPayload.appendMainArgs({
                queryPropsLength: queryProps.length,
                "reqQuery": String(req.query)
            });
            throw new InvalidLininkingTableReqQueryError(errorPayload);
        }

        const queryProp = queryProps[0];
        switch (queryProp) {
            case "cid":
                await AsyncBaseValidations.validateCompositeKey(parseStringifiedArray(req.query.cid), Model, client, errorPayload);
                break;
            case "qid":
                await AsyncBaseValidations.validateQueryableKey(parseStringifiedArray(req.query.qid), Model, client, errorPayload);
                break;
            default:
                throw new SwitchFallThroughRuntimeError("linkingTablesQueryStringValidator", { switchArg: queryProp, auxiliaryArgs: [ {"reqQuery": JSON.parse(JSON.stringify(req.query))} ] });
        }
    }

    static async createRouteBodyCompositeKeysValidator(Model, req, client, errorPayload) {
        const composites = Model.compositePkeys;
        const buildCompositeKeys = [];
        for (let dataObject of req.body) {
            console.log(JSON.stringify(dataObject));
            for (let key of composites) {
                buildCompositeKeys.push(dataObject[key]);
            }
        }
        await AsyncBaseValidations.validateCompositeKeyUniqueness(buildCompositeKeys, Model, client, errorPayload);
    }

    static async tablesDataIterator(Model, idArray = null, body = null, client) {
        const hasBody = body !== null;
        const hasIdArray = idArray !== null;
        const queriesAll = hasIdArray && idArray.length === 0 && idArray[0] === 0;

        const errorPayload = new ErrorPayload();

        if (!hasIdArray && body === null) {
            throw new NoIterationArrayInDataIteratorError(errorPayload);
        }
        if (hasIdArray && idArray.length === 0) {
            throw new IdArrayHasZeroLengthError(errorPayload);
        }
        if (queriesAll && body !== null) {
            errorPayload.appendMainArgs({
                "idArray": JSON.stringify(idArray),
                "body": JSON.stringify(body)
            });
            throw new AllQueryAndBodyError(errorPayload);
        }
        if (hasBody && hasIdArray && idArray.length !== body.length) {

            errorPayload.appendMainArgs({
                "idArray": JSON.stringify(idArray),
                "body": JSON.stringify(req.body)
            });
            throw new IterationArraysHaveUnequalLengthError(errorPayload);
        }

        const iterationLength = hasIdArray ? idArray.length : body.length;

        for (let i = 0; i < iterationLength; i++) {
            errorPayload.auxiliaryArgs.indexOfIteration = i;
            let dataObject = {};
            if (idArray !== null) {
                dataObject[Model.idName] = idArray[i];
            }
            if (hasBody) {
                dataObject = { ...body[i] };
            }
            await AsyncValidationLogic.propValidation(Model, dataObject, client, errorPayload);
        }
    }

    static async linkingTablesDataIterator(Model, idArray = null, body = null, client) {

    }

    static async propValidation(Model, dataObject, client, errorPayload) {
        for (let columnName of Model.columnNamesArray) {
            if (dataObject.hasOwnProperty(columnName)) {
                await AsyncValidationLogic.validationSwitches(columnName, Model.asynchronousConstraintSchema[columnName], dataObject[columnName], Model, client, errorPayload);
            }
        }
    }

    static async validationSwitches(columnName, asynchronousConstraints, data, Model, client, errorPayload) {
        for (let ACI of ACIA) {
            let currentConstraint = asynchronousConstraints[ACI];
            if (currentConstraint) {
                switch (ACI) {
                    case ACIM.primaryKey:
                        await AsyncBaseValidations.validatePrimaryKey(data, Model, client, errorPayload)
                        break;
                    case ACIM.unique:
                        await AsyncBaseValidations.validateUniqueness(columnName, data, Model, client, errorPayload);
                        break;
                    case ACIM.foreignKey:
                        let queryStringConstructor = () => Model.verifyForeignKeyString(currentConstraint.idName, currentConstraint.tableName);
                        await AsyncBaseValidations.validateForeignKey(data, queryStringConstructor, client, errorPayload);
                        queryStringConstructor = null;
                        break;
                    default:
                        throw new SwitchFallThroughRuntimeError("asynchronousConstraintErrorHandling", { switchArg: ACI, auxiliaryArgs: [currentConstraint, data] });
                }
            }
        }
    }
}

module.exports = AsyncValidationLogic;