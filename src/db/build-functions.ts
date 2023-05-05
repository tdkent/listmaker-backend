import db from ".";
import newShoppingSql from "./functions/new-shopping-sql";
import checkShoppingSql from "./functions/check-shopping-sql";
import editShoppingSql from "./functions/edit-shopping-sql";
import newTodoSql from "./functions/new-todo-sql";
import newSubtaskSql from "./functions/new-subtask-sql";
import editSubtaskSql from "./functions/edit-subtask-sql";
import deleteSubtaskSql from "./functions/delete-subtask-sql";
import editTodoSql from "./functions/edit-todo-sql";
import checkTodoSql from "./functions/check-todo-sql";
import removeTodoSql from "./functions/remove-todo-sql";
import deleteListSql from "./functions/delete-list-sql";

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
    DROP FUNCTION IF EXISTS "checkTodo";
    DROP FUNCTION IF EXISTS "removeTodo";
    DROP FUNCTION IF EXISTS "newSubtask";
    DROP FUNCTION IF EXISTS "editSubtask";
    DROP FUNCTION IF EXISTS "deleteSubtask";
    DROP FUNCTION IF EXISTS "deleteTable";
    DROP FUNCTION IF EXISTS "deleteList";
    `);

    // build functions
    console.log("Building SQL functions...");
    await db.query(
      newShoppingSql() +
        checkShoppingSql() +
        editShoppingSql() +
        newTodoSql() +
        editTodoSql() +
        checkTodoSql() +
        removeTodoSql() +
        newSubtaskSql() +
        editSubtaskSql() +
        deleteSubtaskSql() +
        deleteListSql()
    );

    console.log("Finished building SQL functions!");
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while building SQL functions.");
  }
};

export default buildDbFunctions;
