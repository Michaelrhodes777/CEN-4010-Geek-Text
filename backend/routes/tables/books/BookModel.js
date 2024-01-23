const columnNames = {
    "book_id": "book_id",
    "isbn": "isbn",
    "book_name": "book_name",
    "book_description": "book_description",
    "book_price": "book_price",
    "author_id_fkey": "author_id_fkey",
    "genre_id_fkey": "genre_id_fkey",
    "publisher_id_fkey": "publisher_id_fkey",
    "year_published": "year_published",
    "copies_sold": "copies_sold"
};

class BookModel {

    static tableName = "books";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.book_id,
        columnNames.isbn,
        columnNames.book_name,
        columnNames.book_description,
        columnNames.book_price,
        columnNames.author_id_fkey,
        columnNames.genre_id_fkey,
        columnNames.publisher_id_fkey,
        columnNames.year_published,
        columnNames.copies_sold
    ];

    static idName = columnNames.book_id;

    static updateableColumns = BookModel.columnNamesArray.slice(1);
}

module.exports = BookModel;