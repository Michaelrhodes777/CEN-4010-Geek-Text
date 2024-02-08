const ControllerErrors = require('./ControllerErrors.js');
const {
    ErrorPayload,
    NoIterationArrayInDataIteratorError,
    IdArrayHasZeroLengthError,
    AllQueryAndBodyError,
    InvalidPrimaryKeyError,
    UniquenessError,
    SwitchFallThroughRuntimeError
} = ControllerErrors;

// asynchronousConstraintIdentifiersMap
const ACIM = {
    "primaryKey": "primaryKey",
    "unique": "unique"
};

// asynchronousConstraintIdentifiersArray
const ACIA = [
    ACIM.primaryKey,
    ACIM.unique
];

class BaseValidations {
    static async validatePrimaryKey(data, Model, client, errorPayload) {
        const query = {
            text: Model.verifyPrimaryKeyString(Model),
            values: [ data ]
        };
        const response = await client.query(query);
        const resultLength = response.rows.length;
        if (resultLength !== 1) {
            errorPayload.appendMainArgs({
                "primaryKey": data,
                "queryText": query.text,
                "queryValues": JSON.stringify(query.values),
                "responseRows": JSON.stringify(response.rows)
            });
            throw new InvalidPrimaryKeyError(errorPayload);
        }
    }

    static async validateUniqueness(columnName, data, Model, client, errorPayload) {
        const query = {
            text: Model.uniquenessStringConstructor(Model,columnName),
            values: [ data ]
        };
        const response = await client.query(query);
        const resultLength = response.rows.length;
        console.log("hit");
        if (resultLength != 0) {
            errorPayload.appendMainArgs({
                "columnName": columnName,
                "queryString": query.text,
                "valuesArray": JSON.stringify(query.values), 
                "responseRows": JSON.stringify(response.rows)
            });
            throw new UniquenessError(errorPayload);
        }
    }
}

class Logic {

    static async dataIterator(Model, idArray = null, body = null, client) {
        const hasBody = body !== null;
        const hasIdArray = idArray !== null;
        const queriesAll = hasIdArray && idArray.length === 0 && idArray[0] === 0;

        const errorPayload = new ErrorPayload();

        if (!hasIdArray && body === null) {
            Model = null;
            idArray = null;
            client = null;
            throw new NoIterationArrayInDataIteratorError(errorPayload);
        }
        if (hasIdArray && idArray.length === 0) {
            Model = null;
            idArray = null;
            client = null;
            throw new IdArrayHasZeroLengthError(errorPayload);
        }
        if (queriesAll && body !== null) {
            errorPayload.appendMainArgs({
                "idArray": JSON.stringify(idArray),
                "body": JSON.stringify(body)
            });
            Model = null;
            idArray = null;
            client = null;
            throw new AllQueryAndBodyError(errorPayload);
        }
        if (hasBody && hasIdArray && idArray.length !== body.length) {

            errorPayload.appendMainArgs({
                "idArray": JSON.stringify(idArray),
                "body": JSON.stringify(req.body)
            });
            Model = null;
            idArray = null;
            client = null;
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
            await Logic.propValidation(Model, dataObject, client, errorPayload);
        }

        Model = null;
        idArray = null;
        client = null;
    }

    static async propValidation(Model, dataObject, client, errorPayload) {
        for (let columnName of Model.columnNamesArray) {
            if (dataObject.hasOwnProperty(columnName)) {
                await Logic.validationSwitches(columnName, Model.asynchronousConstraintSchema[columnName], dataObject[columnName], Model, client, errorPayload);
            }
        }
        Model = null;
        dataObject = null;
        client = null;
    }

    static async validationSwitches(columnName, asynchronousConstraints, data, Model, client, errorPayload) {
        for (let ACI of ACIA) {
            let currentConstraint = asynchronousConstraints[ACI];
            if (currentConstraint) {
                switch (ACI) {
                    case ACIM.primaryKey:
                            await BaseValidations.validatePrimaryKey(data, Model, client, errorPayload)
                        break;
                    case ACIM.unique:
                            console.log("hit")
                            await BaseValidations.validateUniqueness(columnName, data, Model, client, errorPayload);
                        break;
                    default:
                        throw new SwitchFallThroughRuntimeError("asynchronousConstraintErrorHandling", { switchArg: ACI, auxiliaryArgs: [currentConstraint, data] });
                }
            }
        }

        asynchronousConstraints = null;
        data = null;
        Model = null;
        client = null;
    }
}

class AsyncCompositions {
    static async createControllerAsynchronousValidation(Model, idArray, body = null, client) {
        await Logic.dataIterator(Model, idArray, body, client);
    }

    static async readControllerAsynchronousValidation(Model, idArray, body = null, client) {
        await Logic.dataIterator(Model, idArray, body, client);
    }

    static async updateControllerAsynchronousValidation(Model, idArray, body = null, client) {
        await Logic.dataIterator(Model, idArray, body, client);
    }

    static async deleteControllerAsynchronousValidation(Model, idArray, body = null, client) {
        await Logic.dataIterator(Model, idArray, body, client);
    }
}


module.exports = {
    ACIM,
    ACIA,
    BaseValidations,
    Logic,
    AsyncCompositions
};