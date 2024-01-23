const columnNames = {
    "publisher_id": "publisher_id",
    "publisher_name": "publisher_name",
    "discount_percent": "discount_percent",
};

class PublisherModel {
    static tableName = "publishers";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.publisher_id,
        columnNames.publisher_name,
        columnNames.discount_name
    ];

    static idName = columnNames.publisher_id

    static updateableColumns = PublisherModel.columnNamesArray.slice(1);
}

module.exports = PublisherModel;