import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { EditTodoReqInt, EditTodoReqEnum } from "../../../models/todo";
import checkRequestBody from "../../../utils/check-req-body";
import { RequestErrors } from "../../../models/error";
import db from "../../../db";

const editTodoItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, EditTodoReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { listId, itemId, itemName, itemCategory, itemDate } = <EditTodoReqInt>req.body;

    const { rows }: { rows: { itemId: number }[] } = await db.query(
      `
    UPDATE items_todo
    SET
      item_name = $1,
      item_category = $2,
      date_due = $3,
      date_updated = CURRENT_TIMESTAMP
    WHERE todo_item_id = $4
    AND list_id = $5
    AND user_id = $6
    RETURNING todo_item_id AS "itemId";
    `,
      [itemName, itemCategory, itemDate, itemId, listId, userId]
    );

    if (!rows.length) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({ message: reqError.internalServer() });
  }
};

export default editTodoItem;
