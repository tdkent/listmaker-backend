import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import { NewSubtaskReqInt, NewSubtaskReqEnum } from "../../../models/todo";
import checkRequestBody from "../../../utils/check-req-body";
import db from "../../../db";

const newTodoSubtask: RequestHandler<{ listId: string }> = async (req, res, next) => {
  const { userId } = req.user;
  const { listId } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, NewSubtaskReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { taskName, itemId } = <NewSubtaskReqInt>req.body;

    // db query
    const { rows }: { rows: { newSubtask: any[] }[] } = await db.query(
      `SELECT "newSubtask" ($1, $2, $3, $4)`,
      [itemId, listId, userId, taskName]
    );

    // null result error
    if (!rows.length) {
      res.status(401);
      return next({
        message: reqError.nullResult(),
      });
    }

    // response
    res.json(rows[0].newSubtask);
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default newTodoSubtask;
