const pgp = require("pg-promise")();

const linkDb = `postgres://${process.env.PGADMIN_USER}:${process.env.PGADMIN_PASSWORD}@${process.env.PGADMIN_HOST}:${process.env.PGADMIN_PORT}/${process.env.PGADMIN_DB}`;

const db = pgp(linkDb);

module.exports = db;
