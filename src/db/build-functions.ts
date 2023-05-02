import db from ".";
import newShoppingSql from "./functions/new-shopping-sql";
import checkShoppingSql from "./functions/check-shopping-sql";
import editShoppingSql from "./functions/edit-shopping-sql";
import newTodoSql from "./functions/new-todo-sql";
import editTodoSql from "./functions/edit-todo-sql";
import deleteTableSQl from "./functions/delete-table-sql";

const buildDbFunctions = async () => {
  try {
    // drop functions
    console.log("Dropping SQL functions...");
    await db.query(`
    DROP FUNCTION IF EXISTS "newShopping";
    DROP FUNCTION IF EXISTS "checkShopping";
    DROP FUNCTION IF EXISTS "editShopping";
    DROP FUNCTION IF EXISTS "newTodo";
    DROP FUNCTION IF EXISTS "editTodo";
    DROP FUNCTION IF EXISTS "deleteTable";
    `);

    // build functions
    console.log("Building SQL functions...");
    await db.query(
      newShoppingSql() +
        checkShoppingSql() +
        editShoppingSql() +
        newTodoSql() +
        editTodoSql() +
        deleteTableSQl()
    );

    console.log("Finished building SQL functions!");
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while building SQL functions.");
  }
};

export default buildDbFunctions;