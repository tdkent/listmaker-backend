import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import db from "../../../db";

const deleteSubtask: RequestHandler<{ taskId: string; itemId: string }> = async (
  req,
  res,
  next
) => {
  const { userId } = req.user;
  const { taskId, itemId } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //db query
    const { rows }: { rows: { deleteSubtask: any[] }[] } = await db.query(
      `SELECT "deleteSubtask" ($1, $2, $3)`,
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
    res.json(rows[0].deleteSubtask);
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default deleteSubtask;
