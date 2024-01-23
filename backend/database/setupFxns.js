require('dotenv').config();
const { Client } = require('pg');

const clientFactory = () => {
    const client = new Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    });
    return client;
}

module.exports = {
    clientFactory
};