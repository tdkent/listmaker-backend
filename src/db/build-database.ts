import db from ".";
import buildDbTables from "./build-tables";
import buildDbFunctions from "./build-functions";

const buildDevDb = async () => {
  try {
    await buildDbTables();
    await buildDbFunctions();
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while rebuilding the database.");
  }
};

buildDevDb().finally(() => db.end());
