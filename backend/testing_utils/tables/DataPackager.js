const idAccessorsMap = {
    "users":  [ "user_id" ],
    "credit_cards":  [ "card_id" ],
    "authors": [ "author_id" ],
    "publishers": [ "publisher_id" ],
    "genres": [ "genre_id" ],
    "books": [ "book_id" ],
    "wishlists": [ "wishlist_id" ],
    "reviews": [ "review_id" ],
    "books_wishlists_lt": [ "book_id_fkey", "wishlist_id_fkey" ],
    "shopping_carts_lt": [ "user_id_fkey", "book_id_fkey" ]
};

const keyReferenceMap  = {
    "users": [ "user_id_fkey", "user_id" ],
    "authors": [ "author_id_fkey", "author_id" ],
    "books": [ "book_id_fkey", "book_id" ],
    "publishers": [ "publisher_id_fkey", "publisher_id" ],
    "genres": [ "genre_id_fkey", "genre_id" ],
    "wishlists": [ "wishlist_id_fkey", "wishlist_id" ]
};

class DataSQLObject {
    constructor(identifier, dataObject, deferralPayload = null) {
        this.identifier = identifier;
        if (deferralPayload === null) {
            this.dataObject = dataObject;
        }
        else {
            this.dataObject = { ...dataObject, ...deferralPayload };
        }
        this.stageQueryObject();
    }

    stageQueryObject() {
        const { identifier, dataObject } = this;
        let columns = Object.keys(dataObject);
        let len = columns.length;
        let identifiersBuild = new Array(len);
        let valuesBuild = new Array(len);
        for (let i = 0; i < len; i++) {
            identifiersBuild[i] = `$${i + 1}`;
            valuesBuild[i] = dataObject[columns[i]];
        }
        this.queryObject = {
            text: `INSERT INTO ${identifier} ( ${columns.map((column) => (`${column}`)).join(", ")} ) VALUES ( ${identifiersBuild.join(", ")} ) RETURNING *`,
            values: valuesBuild
        };
    }

    async executeQuery(client) {
        let row;
        const { queryObject } = this;
        try {
            const response = await client.query(queryObject);
            row = response.rows[0];
        }
        catch (error) {
            console.log(error);
        }
        finally {
            return row;
        }
    }
}

class DataPackager {
    constructor(client, dataPayload, dataPackages = null) {
        const { identifier, data, fkeyReferences } = dataPayload;
        this.client = client
        this.identifier = identifier;
        this.data = data;
        this.fkeyReferences = fkeyReferences;
        this.dataPackages = dataPackages;
        this.deferralMap = {};
        this.dataSQLObjects = null;
        this.rows = null;
        this.keyArrays = null;
    }

    stageDeferralMap() {
        const { fkeyReferences, dataPackages, deferralMap } = this;
        for (let currentRef of fkeyReferences) {
            const { identifier, internalIndexes, externalIndexes } = currentRef;
            for (let i = 0; i < internalIndexes.length; i++) {
                const internalIndex = internalIndexes[i];
                const externalIndex = externalIndexes[i];
                if (!deferralMap.hasOwnProperty(internalIndex)) {
                    deferralMap[internalIndex] = {};
                }
                let dataParcel = dataPackages[identifier].getDataParcel(externalIndex, [ keyReferenceMap[identifier] ]);
                deferralMap[internalIndex] = { ...deferralMap[internalIndex], ...dataParcel };
            }
        }
        this.deferralMap = deferralMap;
        return this;
    }

    stageDataSQLObjects() {
        const { identifier, data, deferralMap } = this;
        const dataSQLObjects = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            const deferralPayload = deferralMap.hasOwnProperty(i) ? deferralMap[i] : null;
            dataSQLObjects[i] = new DataSQLObject(identifier, data[i], deferralPayload);
        }
        this.dataSQLObjects = dataSQLObjects;
        return this;
    }

    async stageRows() {
        const { client, dataSQLObjects } = this;
        let len = dataSQLObjects.length;
        const rows = new Array(len);
        for (let i = 0; i < len; i++) {
            rows[i] = await (dataSQLObjects[i]).executeQuery(client);
        }
        this.rows = rows;
        return this;
    }

    stageKeyArrays() {
        const { identifier, rows } = this;
        const idAccessor = idAccessorsMap[identifier];
        const len = rows.length;
        const keyArrays = new Array(len);
        for (let i = 0; i < len; i++) {
            const build = new Array(idAccessor.length);
            for (let j = 0; j < build.length; j++) {
                build[j] = rows[i][idAccessor[j]];
            }
            keyArrays[i] = build;
        }
        this.keyArrays = keyArrays;
        return this;
    }

    async standardStagingChain() {
        let thisRef = this;
        if (this.dataPackages !== null) {
            thisRef = thisRef.stageDeferralMap();
        }
        thisRef = thisRef.stageDataSQLObjects();
        thisRef = await thisRef.stageRows();
        thisRef = thisRef.stageKeyArrays();
        return this;
    }

    getKeyArrays() {
        return this.keyArrays;
    }

    getDataParcel(currentRowIndex, columnArrayDoubles) {
        const build = {};
        for (let columnDouble of columnArrayDoubles) {
            build[columnDouble[0]] = this.rows[currentRowIndex][columnDouble[1]];
        }
        return build;
    }
}

module.exports = DataPackager;