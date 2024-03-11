const fs = require('fs');
const { hashPasswordSync } = require('../backend/util/hashing/Hashing.js');

function typeWrapping(accessment) {
    return typeof accessment === "string" ? `'${accessment}'` : accessment;
}

function insertionBase(tableName, columnNames, json) {
    const valuesString = `${json.map((dataObject) => (`\t\t(${columnNames.map((columnName) => (dataObject[columnName] !== undefined ? `${typeWrapping(dataObject[columnName])}` : "null")).join(", ")})`)).join(",\n")}`;
    return `INSERT INTO ${tableName} ( ${columnNames.map((columnName) => (`${columnName}`)).join(", ")} ) VALUES\n${valuesString}\n;\n`;
}

function scriptGenerator() {
    const orderOfInsertion = [
        "users",
        "credit_cards",
        "authors",
        "publishers",
        "genres",
        "books",
        "wishlists",
        "books_wishlists_lt",
        "reviews",
        "shopping_carts_lt"
    ];

    let build = "";

    for (let table of orderOfInsertion) {
        const json = require(`./${table}/${table}.json`);
        if (table === "users") {
            for (let dataObject of json) {
                dataObject.password = hashPasswordSync(dataObject.password);    
            }
        }
        const columnNames = Object.keys(json[0]);
        build += insertionBase(table, columnNames, json);
    }

    return build;
}

try {
  fs.unlinkSync('./insertion_script.sql');
  console.log('File deleted!');
} catch (err) {
  // Handle specific error if any
  console.error(err.message);
}

fs.writeFile('insertion_script.sql', scriptGenerator(), (err) => {
    if (err) throw new Error();
});