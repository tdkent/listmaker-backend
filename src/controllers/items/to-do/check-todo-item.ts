import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import { CheckTodoReqEnum, CheckTodoReqInt } from "../../../models/todo";
import db from "../../../db";

const checkTodoItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqBody = <CheckTodoReqInt>req.body;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(reqBody, CheckTodoReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // TODO: using CASE check if "isChecked" = false
    // TODO: if false, set "isChecked" = NOT "isChecked" (true)
    // TODO: if true, set "isChecked" = NOT "isChecked" (false), set "dueDate" to CURRENT_DATE

    const { rows }: { rows: { id: number }[] } = await db.query(
      `
      UPDATE items_todo
      SET "isChecked" = CASE WHEN ("isChecked" = false) THEN true ELSE false END
      WHERE id = $1 AND "listId" = $2 AND "userId" = $3
      RETURNING id, "isChecked";
    `,
      [reqBody.itemId, reqBody.listId, userId]
    );

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    return next({
      message: `An error occurred while attempting to edit item (id ${reqBody.itemId})`,
    });
  }
};

export default checkTodoItem;
