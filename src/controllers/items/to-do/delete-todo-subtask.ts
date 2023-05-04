import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import db from "../../../db";

const deleteSubtask: RequestHandler<{ taskId: string }> = async (req, res, next) => {
  const { userId } = req.user;
  console.log("userId: ", userId);
  const { taskId } = req.params;
  console.log("taskId: ", taskId);
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // db query
    // const { rows }: { rows: { newSubtask: any[] }[] } = await db.query(
    //   `SELECT "newSubtask" ($1, $2, $3, $4)`,
    //   [itemId, listId, userId, taskName]
    // );

    // null result error
    // if (!rows.length) {
    //   res.status(401);
    //   return next({
    //     message: reqError.nullResult(),
    //   });
    // }

    // response
    // res.json(rows[0].newSubtask);
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default deleteSubtask;
