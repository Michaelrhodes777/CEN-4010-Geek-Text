const columnNames = {
    "user_id": "user_id",
    "username": "username",
    "password": "password",
    "first_name": "first_name",
    "last_name": "last_name",
    "email_address": "email_address",
    "home_address": "home_address"
};

class UserModel {
    static tableName = "users";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.user_id,
        columnNames.username,
        columnNames.password,
        columnNames.first_name,
        columnNames.last_name,
        columnNames.email_address,
        columnNames.home_address
    ];

    static idName = columnNames.user_id;

    static updateableColumns = UserModel.columnNamesArray.slice(1);
}

module.exports = UserModel;