class InsertSql {
    constructor(tableName, columnNamesArray, dataObject) {
        const valuesArray = [];
        const minColumnNamesArray = [];
        const valueIdentifiersArray = [];
        let identifierNum = 1;
        for (let columnName of columnNamesArray) {
            if (dataObject.hasOwnProperty(columnName)) {
                minColumnNamesArray.push(`"${columnName}"`);
                valuesArray.push(dataObject[columnName]);
                valueIdentifiersArray.push(`$${identifierNum++}`);
            }
        }

        this.sqlString = `INSERT INTO "${tableName}" (${minColumnNamesArray.join(", ")}) VALUES (${valueIdentifiersArray.join(", ")}) RETURNING *`;
        console.log(this.sqlString);
        this.values = valuesArray;
    }

    getSqlQuery() {
        const { sqlString, values } = this;
        return { "text": sqlString, "values": values };
    }
}

class ReadSqlAll {
    constructor(tableName) {
        this.sqlString = `SELECT * FROM "${tableName}"`;
    }

    getSqlQuery() {
        const { sqlString } = this;
        return { "text": sqlString };
    }
}

class ReadSqlById {
    constructor(tableName, idColumnName, idLiteral) {
        this.sqlString = `SELECT * FROM "${tableName}" WHERE "${idColumnName}" = $1`;
        this.values = [ idLiteral ];
    }

    getSqlQuery() {
        const { sqlString, values } = this;
        return { "text": sqlString, "values": values };
    }
}

class UpdateSql {
    constructor(tableName, updateableColumns, dataObject, idColumnTuple) {
        const valuesArray = [];
        const minColumnNamesArray = [];
        for (let columnName of updateableColumns) {
            if (dataObject.hasOwnProperty(columnName)) {
                minColumnNamesArray.push(columnName);
                valuesArray.push(dataObject[columnName]);
            }
        }

        const baseSqlString = `UPDATE "${tableName}"`;
        let identifierNum = 1;
        const setString = "SET " + minColumnNamesArray.map((columnName) => (`"${columnName}" = $${identifierNum++}`)).join(", ");

        const whereClause = `WHERE ${idColumnTuple[0]} = $${identifierNum++}`;
        valuesArray.push(idColumnTuple[1]);

        this.sqlString = baseSqlString + " " + setString + " " + whereClause + " " + "RETURNING *";
        console.log(this.sqlString);
        console.log(valuesArray);
        this.values = valuesArray;
    }

    getSqlQuery() {
        const { sqlString, values } = this;
        return { "text": sqlString, "values": values };
    }
}

class DeleteSql {
    constructor(tableName, idColumnName, idLiteral) {
        this.sqlString = `DELETE FROM "${tableName}" WHERE "${idColumnName}" = $1 RETURNING *`;
        this.values = [ idLiteral ];
    }

    getSqlQuery() {
        const { sqlString, values } = this;
        return { "text": sqlString, "values": values };
    }
}

const CONDITIONS = {
    "create": "create",
    "read_all": "read_all",
    "read_by_id": "read_by_id",
    "put": "put",
    "patch": "patch",
    "delete": "delete"
};

class SqlQueryFactory {
    constructor(Model, data, condition) {
        let sql;
        let idName = Model.idName;
        switch (condition) {
            case CONDITIONS.create:
                sql = new InsertSql(
                    Model.tableName,
                    Model.updateableColumns,
                    data
                );
                break;
            case CONDITIONS.read_by_id:
                sql = new ReadSqlById(
                    Model.tableName,
                    idName,
                    data
                );
                break;
            case CONDITIONS.read_all:
                sql = new ReadSqlAll(
                    Model.tableName,
                );
                break;
            case CONDITIONS.put:
                sql = new UpdateSql(
                    Model.tableName,
                    Model.updateableColumns,
                    data,
                    [ idName, data[idName] ]
                );
                break;
            case CONDITIONS.delete:
                idName = Model.idName;
                sql = new DeleteSql(
                    Model.tableName,
                    idName,
                    data[idName]
                );
                break;
            default:
                throw new Error(`SqlQueryFactory: called with wrong ~condition~ ${condition}. Switch fall through occured`);
        }

        this.queryObject = sql.getSqlQuery();
    }

    getSqlObject() {
        return this.queryObject;
    }
}

module.exports = {
    InsertSql,
    ReadSqlAll,
    ReadSqlById,
    UpdateSql,
    DeleteSql,
    SqlQueryFactory
};