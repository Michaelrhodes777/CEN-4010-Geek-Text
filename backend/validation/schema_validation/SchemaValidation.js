const propsMap = {
    "jsType":"jsType",
    "dbType": "dbType",
    "blacklist": "blacklist",
    "whitelist": "whitelist",
    "requiredList": "requiredList",
    "custom": "custom"
};

class SchemaValidation {
    static propsMap = propsMap;

    static propsArray = [
        propsMap.jsType,
        propsMap.dbType,
        propsMap.blacklist,
        propsMap.whitelist,
        propsMap.requiredList,
        propsMap.custom
    ];

    constructor(Model, schemaObject) {}
}

module.exports = SchemaValidation;