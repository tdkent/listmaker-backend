import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { RequestErrors } from "../../models/error";
import { AllListTypesEnum } from "../../models/list";

const deleteList: RequestHandler<{ listId: string }> = async (req, res, next) => {
  const { userId } = req.user;
  const { listId } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    // db function
    const { rows }: { rows: { deleteTable: boolean }[] } = await db.query(
      `SELECT "deleteTable"($1, $2)`,
      [listId, userId]
    );

    // null result error
    if (!rows[0].deleteTable) {
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
    next({
      message: reqError.internalServer(),
    });
  }
};

export default deleteList;
