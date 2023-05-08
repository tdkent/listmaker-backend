import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { EditTodoReqInt, EditTodoReqEnum, TodoCatsEnum } from "../../../models/todo";
import checkRequestBody from "../../../utils/check-req-body";
import calculateRecurrence from "../../../utils/calc-recurrence";
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

    const {
      listId,
      itemId,
      itemName,
      itemCategory,
      itemLocation,
      itemDate,
      itemTime,
      isRecurring,
      recurVal,
    }: EditTodoReqInt = req.body;

    const recurDate = calculateRecurrence(itemDate, recurVal);

    const { rows }: { rows: { editTodo: boolean }[] } = await db.query(
      `SELECT "editTodo" ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        itemId,
        listId,
        userId,
        itemName,
        itemCategory,
        itemLocation,
        itemDate,
        itemTime,
        isRecurring,
        recurVal,
        recurDate,
      ]
    );

    // null result error
    if (!rows[0].editTodo) {
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
