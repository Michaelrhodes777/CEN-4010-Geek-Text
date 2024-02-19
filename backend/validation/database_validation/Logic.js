const {
    ErrorPayload,
    InvalidPrimaryKeyError,
    InvalidCompositeKeyError,
    CompositeKeyAlreadyExistsError,
    InvalidQueryableKeyError,
    InvalidForeignKeyError,
    UniquenessError
} = require('./Errors.js');

class Logic {
    static async validatePrimaryKeyExists(Model, keyArrays, client, errorPayload) {
        const text = Model.verifyPrimaryKeyString(Model);
        for (let i = 0; i < keyArrays.length; i++) {
            errorPayload.iterationIndex = i;
            const query = {
                text: text,
                values: keyArrays[i]
            };
            console.log(query);
            const response = await client.query(query);
            const resultLength = response.rows.length;
            if (resultLength !== 1) {
                errorPayload.appendMainArgs({
                    "primaryKey": String(keyArrays[i][0]),
                    "queryText": query.text,
                    "queryValues": String(query.values),
                    "responseRows": String(response.rows)
                });
                throw new InvalidPrimaryKeyError(errorPayload);
            }
        }
    }

    static async validateCompositeKeyExists(Model, keyArrays, client, errorPayload) {
        const text = Model.verifyCompositePrimaryKeyString(Model);
        for (let i = 0; i < keyArrays.length; i ++) {
            errorPayload.iterationIndex = i;
            const query = {
                text: text,
                values: keyArrays[i]
            };
            const response = await client.query(query);
            const resultLength = response.rows.length;
            if (resultLength !== 1) {
                errorPayload.appendMainArgs({
                    "compositeKeys": String(keyArrays),
                    "currentIndex": String(i),
                    "currentKeys": String(keyArrays[i]),
                    "queryText": String(query.text),
                    "queryValues": String(query.values),
                    "responseRows": String(response.rows)
                });
                throw new InvalidCompositeKeyError(errorPayload);
            }
        }
    }

    static async validateQueryableKeyExists(Model, keyArrays, client, errorPayload) {
        const text = Model.verifyQueryableKeyString(Model.queryablePkey, Model.tableName);
        for (let i = 0; i < keyArrays.length; i++) {
            errorPayload.iterationIndex = i;
            const query = {
                text: text,
                values: keyArrays[i]
            };
            const response = await client.query(query);
            const resultLength = response.rows.length;
            if (resultLength === 0) {
                errorPayload.appendMainArgs({
                    "queryablePkey": Model.queryablePkey,
                    "currentIndex": String(i),
                    "key": String(keyArrays[i]),
                    "queryText": String(query.text),
                    "queryValues": String(query.values),
                    "responseRows": String(response.rows)
                });
                throw new InvalidQueryableKeyError(errorPayload);
            }
        }
    }

    static async validateCompositeKeyUniqueness(Model, dataArray, client) {
        const errorPayload = new ErrorPayload();
        const text = Model.verifyCompositePrimaryKeyString(Model);
        const { compositePkeys } = Model;
        for (let i = 0; i < dataArray.length; i ++) {
            errorPayload.iterationIndex = i;
            const keyArray = new Array(compositePkeys.length);
            for (let j = 0; j < keyArray.length; j++) {
                keyArray[j] = dataArray[i][compositePkeys[j]];
            }
            const query = {
                text: text,
                values: keyArray
            };
            const response = await client.query(query);
            const resultLength = response.rows.length;
            if (resultLength > 0) {
                errorPayload.appendMainArgs({
                    "compositeKeys": JSON.stringify(dataArray[i]),
                    "currentIndex": String(i),
                    "currentKeys": String(keyArray),
                    "queryText": String(query.text),
                    "queryValues": String(query.values),
                    "responseRows": JSON.stringify(response.rows)
                });
                throw new CompositeKeyAlreadyExistsError(errorPayload);
            }
        }
    }

    static async validateForeignKeyExists(queryStringConstructor, data, client, errorPayload) {
        const query = {
            text: queryStringConstructor(),
            values: [ data ]
        };
        queryStringConstructor = null;
        const response = await client.query(query);
        const resultLength = response.rows.length;
        if (resultLength !== 1) {
            errorPayload.appendMainArgs({
                "foreignKey": data,
                "queryText": query.text,
                "queryValues": JSON.stringify(query.values),
                "responseRows": JSON.stringify(response.rows)
            });
            throw new InvalidForeignKeyError(errorPayload);
        }
    }

    static async validateUniqueness(Model, data, columnName, client, errorPayload) {
        const query = {
            text: Model.uniquenessStringConstructor(Model, columnName),
            values: [ data ]
        };
        const response = await client.query(query);
        const resultLength = response.rows.length;
        if (resultLength != 0) {
            errorPayload.appendMainArgs({
                "columnName": columnName,
                "queryString": query.text,
                "valuesArray": String(query.values), 
                "responseRows": String(response.rows)
            });
            throw new UniquenessError(errorPayload);
        }
    }
}

const LogicTestMap = {
    "validatePrimaryKey": Logic.validatePrimaryKeyExists,
    "validateCompositeKeyExists": Logic.validateCompositeKeyExists,
    "validateQueryableKeyExists": Logic.validateQueryableKeyExists,
    "validateCompositeKeyUniqueness": Logic.validateCompositeKeyUniqueness,
    "validateForeignKeyExists": Logic.validateForeignKeyExists,
    "validateUniqueness": Logic.validateUniqueness
};

module.exports = {
    Logic,
    LogicTestMap
};