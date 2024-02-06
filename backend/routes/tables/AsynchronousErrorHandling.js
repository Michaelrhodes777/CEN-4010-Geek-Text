const ControllerErrors = require('./ControllerErrors.js');
const { 
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

async function validatePrimaryKey(data, Model, client) {
    const query = {
        text: Model.verifyPrimaryKeyString(Model),
        values: [ data ]
    };
    const response = await client.query(query);
    const result = response.rows.length;
    if (result != 1) {
        throw new InvalidPrimaryKeyError(
            String(data),
            query.text,
            JSON.stringify(query.values),
            JSON.stringify(response.rows)
        );
    }
}

async function validateUniqueness(columnName, data, Model, client) {
    const query = {
        text: Model.uniquenessStringConstructor(Model,columnName),
        values: [ data ]
    };
    const response = await client.query(query);
    const result = response.rows.length;
    if (result != 0) {
        throw new UniquenessError(
            columnName,
            query.text,
            JSON.stringify(query.values),
            String(data),
            JSON.stringify(response.rows)
        );
    }
}

async function asynchronousConstraintErrorHandling(columnName, asynchronousConstraints, data, Model, client) {
    console.log(asynchronousConstraints);
    for (let ACI of ACIA) {
        let currentConstraint = asynchronousConstraints[ACI];
        if (currentConstraint) {
            switch (ACI) {
                case ACIM.primaryKey:
                        await validatePrimaryKey(data, Model, client)
                    break;
                case ACIM.unique:
                        await validateUniqueness(columnName, data, Model, client);
                    break;
                default:
                    throw new SwitchFallThroughRuntimeError("asynchronousConstraintErrorHandling", { switchArg: ACI, auxiliaryArgs: [currentConstraint, data] });
            }
        }
    }
}

async function validateAsynchronousRequestData(Model, requestData, client) {
    for (let columnName of Model.columnNamesArray) {
        if (requestData.hasOwnProperty(columnName)) {
            await asynchronousConstraintErrorHandling(columnName, Model.asynchronousConstraintSchema[columnName], requestData[columnName], Model, client);
        }
    }
}

class AsynchronousErrorHandling {
    static ACIM = ACIM;

    static ACIA = ACIA;

    static validatePrimaryKey = validatePrimaryKey;

    static validateUniqueness = validateUniqueness;
    
    static asynchronousConstraintErrorHandling = asynchronousConstraintErrorHandling;

    static validateAsynchronousRequestData = validateAsynchronousRequestData;
}

module.exports = AsynchronousErrorHandling;