const StandardLists = require('../../StandardLists.js');
const { numeric, lowercase, uppercase, alphanumeric, specialCharacters, alphanumericSpecial } = StandardLists;

const columnNames = {
    "username": "username",
    "password": "password"
};

const synchronousConstraintSchema = {
    [columnNames.username]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 8, 32, "]" ]
        },
        blacklist: null,
        whitelist: alphanumeric,
        requiredList: null,
        custom: null
    },
    [columnNames.password]: {
        jsType: "string",
        dbType: { 
            type: "varchar",
            bounds: [ "[", 1, 256, "]" ]
        },
        blacklist: null,
        whitelist: alphanumericSpecial,
        requiredList: [ lowercase, uppercase, numeric, specialCharacters ],
        custom: null
    }
};

class LoginModel {
    static modelName = "LoginModel";

    static tableName = "login";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.username,
        columnNames.password
    ];

    static idName = null;
    static keyName = null;

    static updateableColumns = UserModel.columnNamesArray.slice(1);

    static notNullArray = [ columnNames.username, columnNames.password ];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = null;
}

module.exports = LoginModel;