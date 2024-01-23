const columnNames = {
    "author_id": "author_id",
    "author_name": "author_name",
    "first_name": "first_name",
    "last_name": "last_name",
    "biography": "biography",
    "publisher_id_fkey": "publisher_id_fkey"
};

class AuthorModel {

    static tableName = "authors";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.author_id,
        columnNames.author_name,
        columnNames.first_name,
        columnNames.last_name,
        columnNames.biography,
        columnNames.publisher_id_fkey
    ];

    static idName = columnNames.author_id

    static updateableColumns = AuthorModel.columnNamesArray.slice(1);
}

module.exports = AuthorModel;