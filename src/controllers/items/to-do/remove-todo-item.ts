import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RemoveTodoReqInt, RemoveTodoReqEnum } from "../../../models/todo";
import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import db from "../../../db";

const removeTodoItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, RemoveTodoReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { listId, itemId } = <RemoveTodoReqInt>req.body;

    // db query
    const { rows }: { rows: { removeTodo: boolean }[] } = await db.query(
      `SELECT "removeTodo" ($1, $2, $3)`,
      [itemId, listId, userId]
    );

    // null result error
    if (!rows[0].removeTodo) {
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

export default removeTodoItem;
