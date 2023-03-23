import db from ".";

const buildDbTables = async (): Promise<void> => {
  try {
    console.log("Tearing down old tables...");
    await db.query(`
    DROP TABLE IF EXISTS users;
    `);
    console.log("Creating new tables...");
    await db.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      "userEmail" VARCHAR(255) UNIQUE NOT NULL,
      "userNickname" VARCHAR(60),
      "userPassword" VARCHAR(255) NOT NULL
    );
    `);
    console.log("Finished rebuilding tables!");
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while building db tables.");
  }
};

export default buildDbTables;
