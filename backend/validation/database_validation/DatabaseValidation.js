const propsMap = {
    "foreignKey": "foreignKey",
    "unique": "unique"
};

class DatabaseValidation {
    static propsMap = propsMap;

    static propsArray = [ propsMap.foreignKey, propsMap.unique ];

    constructor(Model, schemaObject) {}
}

module.exports = DatabaseValidation;