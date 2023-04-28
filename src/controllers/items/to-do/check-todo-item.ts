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

    const { rows }: { rows: { itemId: number }[] } = await db.query(
      `
      UPDATE items_todo
      SET
        is_checked = NOT is_checked,
        date_completed = CASE
          WHEN is_checked = false THEN CURRENT_DATE
          ELSE NULL
          END
      WHERE todo_item_id = $1
      AND list_id = $2
      AND user_id = $3
      RETURNING todo_item_id AS "itemId";
    `,
      [itemId, listId, userId]
    );

    // null result error
    if (!rows.length) {
      res.status(401);
      return next({
        message: reqError.nullResult(),
      });
    }

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
