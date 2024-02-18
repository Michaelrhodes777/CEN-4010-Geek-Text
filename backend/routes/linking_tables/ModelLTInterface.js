class ModelLTInterface {
    static verifyCompositePrimaryKeyString(Model) {
        return `SELECT * FROM "${Model.tableName}" WHERE ${Model.compositePkeys.map((key) => (`"${key}" = $${valueIdentifier++}`)).join(" AND ")}`;
    }

    static verifyForeignKeyString(idName, tableName) {
        return `SELECT ( ${idName} ) FROM ${tableName} WHERE ${idName} = $1`;
    }

    static verifyQueryableKeyString(idName, tableName) {
        return `SELECT ( ${idName} ) FROM ${tableName} WHERE ${idName} = $1`;
    }
}

module.exports = ModelLTInterface;