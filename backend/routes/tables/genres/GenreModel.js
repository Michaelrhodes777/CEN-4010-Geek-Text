const columnNames = {
    "genre_id": "genre_id",
    "genre_name": "genre_name"
};

class GenreModel {
    static tableName = "genres";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.genre_id,
        columnNames.genre_name
    ];

    static idName = columnNames.genre_id;

    static updateableColumns = GenreModel.columnNamesArray.slice(1);
}

module.exports = GenreModel;