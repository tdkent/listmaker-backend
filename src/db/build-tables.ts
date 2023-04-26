import db from ".";

const buildDbTables = async () => {
  try {
    console.log("Tearing down old tables...");
    await db.query(`
    DROP TABLE IF EXISTS items_todo;
    DROP TABLE IF EXISTS items_shopping;
    DROP TABLE IF EXISTS lists;
    DROP TABLE IF EXISTS users;
    `);
    console.log("Creating new tables...");
    await db.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      "userEmail" VARCHAR(255) UNIQUE NOT NULL,
      "userNickname" VARCHAR(255),
      "userPassword" VARCHAR(255) NOT NULL
    );
    CREATE TABLE lists (
      id SERIAL PRIMARY KEY,
      "userId" SMALLINT REFERENCES users(id),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL,
      type VARCHAR(12) NOT NULL
    );
      CREATE TABLE items_shopping (
        id SERIAL PRIMARY KEY,
        "listId" SMALLINT REFERENCES lists(id),
        "userId" SMALLINT REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        perm_category VARCHAR(255) NOT NULL DEFAULT 'Uncategorized',
        temp_category VARCHAR(255) NOT NULL DEFAULT 'Uncategorized',
        "isChecked" BOOLEAN NOT NULL DEFAULT false,
        "isActive" BOOLEAN NOT NULL DEFAULT true
      );
      CREATE TABLE items_todo (
        id SERIAL PRIMARY KEY,
        "listId" SMALLINT REFERENCES lists(id),
        "userId" SMALLINT REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(12) NOT NULL DEFAULT 'Home',
        notes VARCHAR(255),
        "dateCreated" DATE NOT NULL DEFAULT CURRENT_DATE,
        "dateDue" DATE NOT NULL DEFAULT CURRENT_DATE,
        "dateCompleted" DATE,
        "isChecked" BOOLEAN NOT NULL DEFAULT false
      )
    `);
    console.log("Finished rebuilding tables!");
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while building db tables.");
  }
};

export default buildDbTables;
