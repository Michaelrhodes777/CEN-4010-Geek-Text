class ModelLTInterface {
    static verifyCompositePrimaryKeyString(Model) {
        let valueIdentifier = 1;
        return `SELECT ( ${Model.compositePkeys.map((key) => (`"${key}"`)).join(", ")} ) FROM ${Model.tableName} WHERE ${Model.compositePkeys.map((key) => (`"${key}" = $${valueIdentifier++}`)).join(" AND ")}`;
    }

    static verifyForeignKeyString(idName, tableName) {
        return `SELECT ( ${idName} ) FROM ${tableName} WHERE ${idName} = $1`;
    }

    static verifyQueryableKeyString(idName, tableName) {
        return `SELECT ( ${idName} ) FROM ${tableName} WHERE ${idName} = $1`;
    }
}

module.exports = ModelLTInterface;