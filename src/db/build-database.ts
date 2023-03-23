import db from ".";
import buildDbTables from "./build-tables";

const buildDevDb = async () => {
  try {
    await buildDbTables();
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while rebuilding the database.");
  }
};

buildDevDb().finally(() => db.end());
