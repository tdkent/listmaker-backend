import db from ".";
import newTodoSql from "./functions/new-todo-sql";
import editTodoSql from "./functions/edit-todo-sql";
import deleteTableSQl from "./functions/delete-table-sql";

const buildDbFunctions = async () => {
  try {
    // drop functions
    console.log("Dropping SQL functions...");
    await db.query(`
    DROP FUNCTION IF EXISTS "newTodo";
    DROP FUNCTION IF EXISTS "editTodo";
    DROP FUNCTION IF EXISTS "deleteTable";
    `);

    // build functions
    console.log("Building SQL functions...");
    await db.query(newTodoSql() + editTodoSql() + deleteTableSQl());

    console.log("Finished building SQL functions!");
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while building SQL functions.");
  }
};

export default buildDbFunctions;
