import sqlite3 from "sqlite3";

;

const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        console.error(err.message);
    }

    db.run(
        `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      phone INTEGER,
      age TEXT,
      email TEXT,
      address TEXT
    )`
    );
});

export default db;

