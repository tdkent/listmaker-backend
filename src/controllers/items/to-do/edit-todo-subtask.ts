import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import { EditSubtaskReqInt, EditSubtaskReqEnum } from "../../../models/todo";
import db from "../../../db";

const editSubtask: RequestHandler<{ itemId: string }> = async (req, res, next) => {
  const { userId } = req.user;
  const { itemId } = req.params;

  console.log(req.body);
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, EditSubtaskReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { taskId, newName } = <EditSubtaskReqInt>req.body;

    // db query
    const { rows }: { rows: { editSubtask: any[] }[] } = await db.query(
      `SELECT "editSubtask" ($1, $2, $3, $4)`,
      [taskId, itemId, userId, newName]
    );

    // null result error
    if (!rows.length) {
      res.status(401);
      return next({
        message: reqError.nullResult(),
      });
    }

    // response
    res.json(rows[0].editSubtask);
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default editSubtask;
