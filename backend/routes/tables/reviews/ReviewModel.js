const columnNames = {
    "review_id": "review_id",
    "rating": "rating",
    "comment": "comment",
    "date_stamp": "date_stamp",
    "user_id_fkey": "user_id_fkey",
    "book_id_fkey": "book_id_fkey"
};

class ReviewModel {
    static tableName = "reviews";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.review_id,
        columnNames.rating,
        columnNames.comment,
        columnNames.date_stamp,
        columnNames.user_id_fkey,
        columnNames.book_id_fkey
    ];

    static idName = columnNames.review_id;

    static updateableColumns = ReviewModel.columnNamesArray.slice(1);
}

module.exports = ReviewModel;