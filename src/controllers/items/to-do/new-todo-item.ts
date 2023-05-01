import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../../db";
import { NewItemReqEnum, NewItemReqInt } from "../../../models/item";
import { NewTodoReqInt } from "../../../models/todo";
import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";

const newTodoItem: RequestHandler<{ listId: string }> = async (req, res, next) => {
  const { userId } = req.user;
  const { listId } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, NewItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { itemName } = <NewTodoReqInt>req.body;

    // call db function
    const { rows }: { rows: { newTodo: boolean }[] } = await db.query(
      `
      SELECT "newTodo" ($1, $2, $3)
      `,
      [listId, userId, itemName]
    );

    // error handling
    if (!rows[0].newTodo) {
      res.status(401);
      return next({ message: reqError.nullResult() });
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

export default newTodoItem;
