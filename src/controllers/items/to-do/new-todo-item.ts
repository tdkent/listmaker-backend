import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../../db";
import { AllListTypesEnum } from "../../../models/list";
import { NewItemReqEnum, NewItemReqInt } from "../../../models/item";
import { NewTodoReqEnum, NewTodoReqInt } from "../../../models/todo";
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
    const reqBody = <NewTodoReqInt>req.body;
    console.log("reqBody: ", reqBody);
    if (!checkRequestBody(reqBody, NewItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // check auth & list type
    const { rows: checkAuth }: { rows: { type: string }[] } = await db.query(
      `
    SELECT type FROM lists
    WHERE id = $1 AND "userId" = $2;
    `,
      [Number(listId), userId]
    );

    // error handling
    if (!checkAuth.length || checkAuth[0].type !== AllListTypesEnum.todo) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // has user previously created this item
    const { rows }: { rows: { id: number; category: string }[] } = await db.query(
      `
      SELECT id, category FROM items_todo
      WHERE name = $1 AND "userId" = $2;
    `,
      [reqBody.name, userId]
    );

    // new item: create new row
    if (!rows.length) {
      await db.query(
        `
        INSERT INTO items_todo ("listId", "userId", name)
        VALUES ($1, $2, $3);
        `,
        [Number(listId), userId, reqBody.name]
      );
    }

    // duplicate item: create new row, copy fields from old item
    // TODO: if multiple duplicates exist, fields should be copied from the most recently created
    // TODO: add a dateCreated field to items_todo table
    else {
      await db.query(
        `
        INSERT INTO items_todo ("listId", "userId", name, category)
        VALUES ($1, $2, $3, $4)
        `,
        [Number(listId), userId, reqBody.name, rows[0].category]
      );
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
