import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { EditTodoReqInt, EditTodoReqEnum, TodoCatsEnum } from "../../../models/todo";
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

    const { itemCategory } = <EditTodoReqInt>req.body;

    // sanitize request body
    let body: EditTodoReqInt;
    if (itemCategory === TodoCatsEnum.home) {
      body = { ...req.body, itemLocation: null, itemTime: null };
    } else if (itemCategory === TodoCatsEnum.work) {
      body = { ...req.body, itemLocation: null };
    } else if (itemCategory === TodoCatsEnum.errand) {
      body = { ...req.body, itemTime: null };
    } else body = { ...req.body };

    // query
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    UPDATE items_todo
    SET
      item_name = $1,
      item_category = $2, 
      item_location = $3,
      date_due = $4,
      date_updated = CURRENT_TIMESTAMP,
      time_due = $5
    WHERE todo_item_id = $6
    AND list_id = $7
    AND user_id = $8
    RETURNING todo_item_id AS "id";
    `,
      [
        body.itemName,
        body.itemCategory,
        body.itemLocation,
        body.itemDate,
        body.itemTime,
        body.itemId,
        body.listId,
        userId,
      ]
    );

    // null result error
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
