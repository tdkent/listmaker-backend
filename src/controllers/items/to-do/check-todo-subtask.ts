import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import { CheckSubtaskReqInt, CheckSubtaskReqEnum } from "../../../models/todo";
import db from "../../../db";

const checkSubtask: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, CheckSubtaskReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { taskId, itemId } = <CheckSubtaskReqInt>req.body;

    // db query
    const { rows } = await db.query(
      `
    UPDATE todo_subtasks
    SET is_checked = NOT is_checked
    WHERE subtask_id = $1
    AND todo_item_id = $2
    AND user_id = $3
    RETURNING subtask_id;
    `,
      [taskId, itemId, userId]
    );

    // null result error
    if (!rows.length) {
      res.status(401);
      return next({
        message: reqError.nullResult(),
      });
    }

    // response
    // res.json(rows[0].editSubtask);
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default checkSubtask;
