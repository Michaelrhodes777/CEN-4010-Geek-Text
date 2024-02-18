const {
    InvalidPrimaryKeyError,
    InvalidCompositeKeyError,
    CompositeKeyAlreadyExistsError,
    InvalidQueryableKeyError,
    InvalidForeignKeyError,
    UniquenessError
} = require('./ValidationErrors.js');

class AsyncBaseValidations {
    static async validatePrimaryKey(data, Model, client, errorPayload) {
        console.log(Model);
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

    static async validateCompositeKey(data, Model, client, errorPayload) {
        const numKeys = Model.compositePkeys.length;
        console.log(Model.verifyCompositePrimaryKeyString(Model));
        for (let i = 0; i < data.length; i += numKeys) {
            const currentKeys = new Array(numKeys);
            for (let j = 0; j < numKeys; j++) {
                currentKeys[j] = Number.parseInt(data[i + j]);
            }
            const query = {
                text: Model.verifyCompositePrimaryKeyString(Model),
                values: currentKeys
            };
            console.log(query.values);
            const response = await client.query(query);
            const resultLength = response.rows.length;
            console.log(response.rows);
            if (resultLength !== 1) {
                errorPayload.appendMainArgs({
                    "compositeKeys": String(data),
                    "currentIndex": String(i),
                    "currentKeys": String(currentKeys),
                    "queryText": String(query.text),
                    "queryValues": String(query.values),
                    "responseRows": String(response.rows)
                });
                throw new InvalidCompositeKeyError(errorPayload);
            }
        }
    }

    static async validateCompositeKeyUniqueness(data, Model, client, errorPayload) {
        const numKeys = Model.compositePkeys.length;
        for (let i = 0; i < data.length; i += numKeys) {
            const currentKeys = new Array(numKeys);
            for (let j = 0; j < numKeys; j++) {
                currentKeys[j] = data[i + j];
            }
            const query = {
                text: Model.verifyCompositePrimaryKeyString(Model),
                values: [ ...currentKeys ]
            };
            const response = await client.query(query);
            const resultLength = response.rows.length;
            if (resultLength > 0) {
                errorPayload.appendMainArgs({
                    "compositeKeys": String(data),
                    "currentIndex": String(i),
                    "currentKeys": String(currentKeys),
                    "queryText": String(query.text),
                    "queryValues": String(query.values),
                    "responseRows": String(response.rows)
                });
                throw new CompositeKeyAlreadyExistsError(errorPayload);
            }
        }
    }

    static async validateQueryableKey(data, Model, client, errorPayload) {
        const numKeys = data.length;
        for (let i = 0; i < numKeys; i++) {
            const query = {
                text: Model.verifyQueryableKeyString(Model.queryablePkey, Model.tableName),
                values: [ data[i] ]
            };
            const response = await client.query(query);
            const resultLength = response.rows.length;
            if (resultLength === 0) {
                errorPayload.appendMainArgs({
                    "queryablePkey": Model.queryablePkey,
                    "currentIndex": String(i),
                    "key": String(data),
                    "queryText": String(query.text),
                    "queryValues": String(query.values),
                    "responseRows": String(response.rows)
                });
                throw new InvalidQueryableKeyError(errorPayload);
            }
        }
    }

    static async validateForeignKey(data, queryStringConstructor, client, errorPayload) {
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

    static async validateUniqueness(columnName, data, Model, client, errorPayload) {
        const query = {
            text: Model.uniquenessStringConstructor(Model,columnName),
            values: [ data ]
        };
        const response = await client.query(query);
        const resultLength = response.rows.length;
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

module.exports = AsyncBaseValidations;