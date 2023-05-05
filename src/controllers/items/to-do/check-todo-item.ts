import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import { CheckTodoReqEnum, CheckTodoReqInt } from "../../../models/todo";
import db from "../../../db";

const checkTodoItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, CheckTodoReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { itemId, listId } = <CheckTodoReqInt>req.body;

    await db.query(`
    CREATE OR REPLACE FUNCTION "checkTodo" 
      (i_id int, l_id int, u_id int)
    RETURNS bool LANGUAGE plpgsql AS
    $func$
    DECLARE
    ischecked bool;
    BEGIN
    ischecked := (
      SELECT is_checked
      FROM items_todo
      WHERE todo_item_id = i_id
      AND list_id = l_id
      AND user_id = u_id
    ); 
    IF ischecked IS NULL THEN
    RETURN false;
    ELSE
      IF (ischecked = false) THEN
        UPDATE items_todo
        SET
          is_checked = true,
          date_completed = CURRENT_DATE
        WHERE todo_item_id = i_id;
        UPDATE todo_subtasks
        SET is_checked = true
        WHERE todo_item_id = i_id;
      ELSE
        UPDATE items_todo
        SET
          is_checked = false,
          date_completed = NULL
        WHERE todo_item_id = i_id;
        UPDATE todo_subtasks
        SET is_checked = false
        WHERE todo_item_id = i_id;
      END IF;
    RETURN true;
    END IF;
    END;
    $func$;
`);

    const { rows } = await db.query(`SELECT "checkTodo" ($1, $2, $3)`, [itemId, listId, userId]);
    console.log("rows: ", rows);

    // const { rows }: { rows: { itemId: number }[] } = await db.query(
    //   `
    //   UPDATE items_todo
    //   SET
    //     is_checked = NOT is_checked,
    //     date_completed = CASE
    //       WHEN is_checked = false THEN CURRENT_DATE
    //       ELSE NULL
    //       END
    //   WHERE todo_item_id = $1
    //   AND list_id = $2
    //   AND user_id = $3
    //   RETURNING todo_item_id AS "itemId";
    // `,
    //   [itemId, listId, userId]
    // );

    // // null result error
    // if (!rows.length) {
    //   res.status(401);
    //   return next({
    //     message: reqError.nullResult(),
    //   });
    // }

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    return next({
      message: reqError.internalServer(),
    });
  }
};

export default checkTodoItem;
