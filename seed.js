require("dotenv").config();
const express = require("express");
const app = express();
const pg = require("pg");
const PORT = 3000;
const client = new pg.Client(process.env.DATABASE_URL);
console.log(process.env);
const init = async (req, res) => {
  try {
    await client.connect();
    const SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100),
            is_favorite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        INSERT INTO flavors(name, is_favorite) VALUES ('Rocky Road', true);
        INSERT INTO flavors(name) VALUES ('Vanilla');
    `;
    await client.query(SQL);
    await client.end();
    console.log("The database is seeded");
  } catch (error) {
    console.error(error);
  }
};

init();
