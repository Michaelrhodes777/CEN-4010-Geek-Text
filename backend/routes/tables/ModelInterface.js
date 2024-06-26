class ModelInterface {
    static staticProps = {
        "modelName": "modelName",
        "tableName": "tableName",
        "columnNamesMap": "columnNamesMap",
        "columnNamesArray": "columnNamesArray",
        "idName": "idName",
        "notNullArray": "notNullArray",
        "updateableColumns": "updateableColumns",
        "synchronousConstraintSchema": "synchronousConstraintSchema",
        "asynchronousConstraintSchema": "asynchronousConstraintSchema"
    };

    static queryStringRequirements = {
        "c": null,
        "r": [ "id" ],
        "u": [ "id" ],
        "d": [ "id" ]
    };

    static verifyPrimaryKeyString(Model) {
        return `SELECT ( ${Model.idName} ) FROM ${Model.tableName} WHERE ${Model.idName} = $1`;
    }

    static verifyForeignKeyString(idName, tableName) {
        return `SELECT ( ${idName} ) FROM ${tableName} WHERE ${idName} = $1`;
    }

    static uniquenessStringConstructor(Model, columnName) {
        return `SELECT ( "${columnName}" ) FROM ${Model.tableName} WHERE "${columnName}" = $1`;
    }
}

module.exports = ModelInterface;