class QueryInterface {

    static identifierMapper(identifierArray) {
        return `${identifierArray.map((identifier) => (`"${identifier}"`)).join(", ")}`;
    }

    static valueIdentifiersMapper(valueIdentifiers) {
        return `${valueIdentifiers.map((num) => (`$${num}`)).join(", ")}`;
    }

    static compositeKeyMapper(compositeArray) {
        let index = 1;
        return `${compositeArray.map((name) => (`"${name}" = $${index++}`)).join(" AND ")}`;
    }

    constructor(payload) {
        const { Model, dataObject, keyArray } = payload;
        this.Model = Model;
        this.dataObject = dataObject;
        this.keyArray = keyArray;
        this.sqlString = null;
        this.values = null;
        payload = null;
    }

    getSqlQuery() {
        const { sqlString, values } = this;
        const build = {
            "text": sqlString
        };
        if (values !== null) {
            build.values = values;
        }
        return build;
    }
}

class CreateQuery extends QueryInterface {
    generateQueryObject() {
        let { Model, dataObject } = this;
        let columnIdentifiers = [];
        let index = 1;
        let valueIdentifiers = [];
        let values = [];
        for (let columnName of Model.columnNamesArray) {
            if (dataObject.hasOwnProperty(columnName)) {
                columnIdentifiers.push(columnName);
                valueIdentifiers.push(index++);
                values.push(dataObject[columnName]);
            }
            dataObject[columnName] = null;
        }

        this.sqlString = `INSERT INTO "${Model.tableName}" ( ${QueryInterface.identifierMapper(columnIdentifiers)} ) VALUES ( ${QueryInterface.valueIdentifiersMapper(valueIdentifiers)} ) RETURNING *`;
        this.values = values;
    }
}

class ReadByIdQuery extends QueryInterface {
    generateQueryObject() {
        let { Model, keyArray } = this;
        this.sqlString = `SELECT * FROM "${Model.tableName}" WHERE ${Model.idName} = $1`;
        this.values = keyArray;
    }
}

class ReadAllQuery extends QueryInterface {
    generateQueryObject() {
        const { Model } = this;
        this.sqlString = `SELECT * FROM "${Model.tableName}"`;
        this.values = null;
    }
}

class ReadByQidQuery extends QueryInterface {
    generateQueryObject() {
        let { Model, keyArray } = this;
        this.sqlString = `SELECT * FROM "${Model.tableName}" WHERE ${Model.queryablePkey} = $1`;
        this.values = keyArray;
    }
}

class ReadByCidQuery extends QueryInterface {
    generateQueryObject() {
        let { Model, keyArray } = this;
        this.sqlString = `SELECT * FROM "${Model.tableName}" WHERE ${QueryInterface.compositeKeyMapper(Model.compositePkeys)}`;
        this.values = keyArray;
    }
}

class UpdateByIdQuery extends QueryInterface {
    generateQueryObject() {
        let { Model, dataObject, keyArray } = this;
        let values = [];

        let index = 1;
        const setStringBuild = [];
        for (let column of Model.updateableColumns) {
            if (dataObject.hasOwnProperty(column)) {
                setStringBuild.push(`"${column}" = $${index++}`);
                values.push(dataObject[column]);
            }
        }
        values.push(keyArray[0]);

        const baseString = `UPDATE ${Model.tableName}`;
        const setString = "SET " + setStringBuild.join(", ");
        const whereClause = `WHERE "${Model.idName}" = $${index} RETURNING *`;

        this.sqlString = baseString + " " + setString + " " + whereClause;
        this.values = values;
    }
}

class UpdateByCidQuery extends QueryInterface {
    generateQueryObject() {
        let { Model, dataObject, keyArray } = this;
        let values = [];

        let index = 1;
        const setStringBuild = [];
        for (let column of Model.updateableColumns) {
            if (dataObject.hasOwnProperty(column)) {
                setStringBuild.push(`"${column}" = ${index++}`);
                values.push(dataObject[column]);
            }
        }
        
        const whereStringBuild = [];
        let altIndex = 0;
        for (let composite of Model.compositePkeys) {
            whereStringBuild.push(`"${composite}" = ${index++}`);
            values.push(keyArray[altIndex++]);
        }

        const baseString = `UPDATE ${Model.tableName}`;
        const setString = "SET " + setStringBuild.join(", ");
        const whereClause = `WHERE ${whereStringBuild.join(", ")}`;

        this.sqlString = baseString + " " + setString + " " + whereClause;
        this.values = values;
    }
}

class DeleteByIdQuery extends QueryInterface {
    generateQueryObject() {
        const { Model, keyArray } = this;
        this.sqlString = `DELETE FROM "${Model.tableName}" WHERE ${Model.idName} = $1 RETURNING *`;
        this.values = keyArray;
    }
}

class DeleteByQidQuery extends QueryInterface {
    generateQueryObject() {
        let { Model, keyArray } = this;
        this.sqlString = `DELETE FROM "${Model.tableName}" WHERE ${Model.queryablePkey} = $1 RETURNING *`;
        this.values = keyArray;
    }
}

class DeleteByCidQuery extends QueryInterface {
    generateQueryObject() {
        let { Model, keyArray } = this;
        this.sqlString = `DELETE FROM "${Model.tableName}" WHERE ${QueryInterface.compositeKeyMapper(Model.compositePkeys)} RETURNING *`;
        this.values = keyArray;
    }
}

const CONDITIONS = {
    "create": "create",
    "readById": "readById",
    "readAll": "readAll",
    "readByQid": "readByQid",
    "readByCid": "readByCid",
    "updateById": "updateById",
    "updateByCid": "updateByCid",
    "deleteById": "deleteById",
    "deleteByQid": "deleteByQid",
    "deleteByCid": "deleteByCid"
};

const conditionMap = {
    [CONDITIONS.create]: CreateQuery,
    [CONDITIONS.readById]: ReadByIdQuery,
    [CONDITIONS.readAll]: ReadAllQuery,
    [CONDITIONS.readByQid]: ReadByQidQuery,
    [CONDITIONS.readByCid]: ReadByCidQuery,
    [CONDITIONS.updateById]: UpdateByIdQuery,
    [CONDITIONS.updateByCid]: UpdateByCidQuery,
    [CONDITIONS.deleteById]: DeleteByIdQuery,
    [CONDITIONS.deleteByQid]: DeleteByQidQuery,
    [CONDITIONS.deleteByCid]: DeleteByCidQuery,
};

class SqlQueryFactory {

    static CONDITIONS = CONDITIONS;

    constructor(Model, dataObject = null, keyArray = null, condition) {
        let sql = new conditionMap[condition]({ Model, dataObject, keyArray });
        sql.generateQueryObject();
        this.sqlQueryObject = sql.getSqlQuery();
    }

    getSqlQueryObject() {
        return this.sqlQueryObject;
    }
}

module.exports = {
    CreateQuery,
    ReadByIdQuery,
    ReadAllQuery,
    ReadByQidQuery,
    ReadByCidQuery,
    UpdateByIdQuery,
    UpdateByCidQuery,
    DeleteByIdQuery,
    DeleteByQidQuery,
    DeleteByCidQuery,
    SqlQueryFactory
};