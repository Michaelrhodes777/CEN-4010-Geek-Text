const { clientFactory } = require('../database/setupFxns.js');
const DataPackager = require('./tables/DataPackager.js');

const compositeKeyColumnNamesMap = {
    "books_wishlists_lt": [ "book_id_fkey", "wishlist_id_fkey" ],
    "shopping_carts_lt": [ "user_id_fkey", "book_id_fkey" ]
};

const idMap = {
    "users": "user_id",
    "credit_cards": "card_id",
    "authors": "author_id",
    "publishers": "publisher_id",
    "genres": "genre_id",
    "books": "book_id",
    "wishlists": "wishlist_id",
    "reviews": "review_id"
};

class DatabaseControl {
    constructor(databaseInstantiationPayload) {
        const { identifiers, nonCascadeDeletions, dataPayloads } = databaseInstantiationPayload;
        this.identifiers = identifiers;
        this.nonCascadeDeletions = nonCascadeDeletions;
        this.dataPayloads = dataPayloads;
        let skeleton = {};
        for (let identifier of databaseInstantiationPayload.identifiers) {
            skeleton[identifier] = undefined;
        }
        this.dataPackages = JSON.parse(JSON.stringify(skeleton));
        this.keyArrays = JSON.parse(JSON.stringify(skeleton));
        this.deletionResultsMap = skeleton;
        skeleton = null;
    }

    async setupDatabase() {
        const client = clientFactory();
        let transactionBegun = false;
        try {
            await client.connect();
            await client.query("BEGIN");
            transactionBegun = true;

            const { identifiers, dataPayloads, dataPackages, keyArrays } = this;
            for (let i = 0; i < identifiers.length; i++) {
                let identifier = identifiers[i];
                let payload = dataPayloads[i];
                dataPackages[identifier] = new DataPackager(client, payload, payload.fkeyReferences === undefined ? null : dataPackages);
                await dataPackages[identifier].standardStagingChain();
                keyArrays[identifier] = dataPackages[identifier].getKeyArrays();
            }

            await client.query("COMMIT");
        }
        catch (error) {
            if (transactionBegun) {
                await client.query("ROLLBACK");
            }
        }
        finally {
            await client.end();
        }
    }

    async tearDownDatabase() {
        let client = clientFactory();
        let transactionBegun = false;
        try {
            await client.connect();
            await client.query("BEGIN");
            for (let identifier of this.nonCascadeDeletions) {
                let fxnRef = compositeKeyColumnNamesMap.hasOwnProperty(identifier)
                    ? this.compositeKeyDeletion
                    : this.primaryKeyDeletion;
                await fxnRef(client, identifier, this);
            }
            transactionBegun = true;
            await client.query("COMMIT");
        }
        catch (error) {
            if (transactionBegun) {
                await client.query("ROLLBACK");
            }
        }
        finally {
            await client.end();
        }
    }

    async primaryKeyDeletion(client, identifier, thisRef) {
        let values = thisRef.keyArrays[identifier].map((array) => (array[0]));
        let index = 1;
        const deletionResult = await client.query({
            text: `DELETE FROM ${identifier} WHERE ${idMap[identifier]} IN (${values.map(() => (`$${index++}`)).join(", ")}) RETURNING *`,
            values: values
        });
        thisRef.deletionResultsMap[identifier] = deletionResult.rows;
    }

    async compositeKeyDeletion(client, identifier, thisRef) {
        this.deletionResultsMap[identifier] = [];
        let keyArrays = thisRef.keyArrays[identifier];
        for (let values of keyArrays) {
            const whereClauseBuild = new Array(values.length);
            for (let i = 0; i < whereClauseBuild.length; i++) {
                whereClauseBuild[i] = `${compositeKeyColumnNamesMap[i]} = $${i + 1}`;
            }
            let result = await client.query({
                text: `DELETE FROM ${identifier} WHERE ${whereClauseBuild.join(" AND ")} RETURNING *`,
                values: values
            });
            thisRef.deletionResultsMap[identifier].push(result.rows[0]);
        }
    }

    getKeyArraysFromMap(identifier) {
        return this.keyArrays[identifier];
    }

    getDeletionResultsFromMap(identifier) {
        return this.deletionResultsMap[identifier];
    }
}

module.exports = DatabaseControl;