import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import calculateRecurrence from "../../../utils/calc-recurrence";
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

    // need to add recurVal, recurDate to req.body
    // if either value exists, add recurVal to recurDate to create a new recurDate
    // add this value to checkTodo function args
    // if is_recurring = true, add this date to the newly created row

    const { itemId, listId, recurDate, recurVal } = <CheckTodoReqInt>req.body;

    const newRecurDate = (date: string, val: string) => {
      if (date && val) return calculateRecurrence(date, val);
      else return null;
    };

    // db query
    const { rows }: { rows: { checkTodo: boolean }[] } = await db.query(
      `SELECT "checkTodo" ($1, $2, $3, $4)`,
      [itemId, listId, userId, newRecurDate(recurDate, recurVal)]
    );

    // null result error
    if (!rows[0].checkTodo) {
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
