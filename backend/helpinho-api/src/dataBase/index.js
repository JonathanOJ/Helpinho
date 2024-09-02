const db = require("./../models/connection");

const createTables = async () => {
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT,
      email TEXT,
      image TEXT,
      password TEXT,
      cpf_cnpj TEXT,
      birthdate DATE,
      total_donated FLOAT,
      total_helpinhos_donated INTEGER,
      total_helpinhos_created INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    )
    .then(() => console.log("Table users created"))
    .catch((err) => {
      console.error("Error creating users table:", err);
      throw err;
    });

  console.log("Creating helpinhos table");
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS helpinhos (
      id SERIAL PRIMARY KEY,
      title TEXT,
      description TEXT,
      image TEXT,
      category TEXT[],
      users_donated JSONB,
      value FLOAT,
      request_emergency BOOLEAN,
      emergency BOOLEAN,
      user_responsable JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    )
    .then(() => console.log("Table products created"))
    .catch((err) => {
      console.error("Error creating products table:", err);
      throw err;
    });

  console.log("Creating donations table");
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      userId INTEGER,
      helpinho_id INTEGER,
      value FLOAT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    )
    .then(() => console.log("Table donations created"))
    .catch((err) => {
      console.error("Error creating donations table:", err);
      throw err;
    });
};

createTables();
