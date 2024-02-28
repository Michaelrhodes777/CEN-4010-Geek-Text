class ModelLTInterface {
    static staticProps = {
        "modelName": "modelName",
        "tableName": "tableName",
        "columnNamesMap": "columnNamesMap",
        "compositePkeys": "compositePkeys",
        "columnNamesArray": "columnNamesArray",
        "queryablePkey": "queryablePkey",
        "notNullArray": "notNullArray",
        "updateableColumns": "updateableColumns",
        "synchronousConstraintSchema": "synchrounousConstraintSchema",
        "asynchronousConstraintSchema": "asynchronousConstraintSchema"
    };

    static verifyCompositePrimaryKeyString(Model) {
        let valueIdentifier = 1;
        const keys = Model.compositePkeys;
        return `SELECT ${keys.map((key) => (`${key}`)).join(", ")} FROM "${Model.tableName}" WHERE ${keys.map((key) => (`"${key}" = $${valueIdentifier++}`)).join(" AND ")}`;
    }

    static verifyForeignKeyString(idName, tableName) {
        return `SELECT ( ${idName} ) FROM ${tableName} WHERE ${idName} = $1`;
    }

    static verifyQueryableKeyString(idName, tableName) {
        return `SELECT ( ${idName} ) FROM ${tableName} WHERE ${idName} = $1`;
    }
}

module.exports = ModelLTInterface;