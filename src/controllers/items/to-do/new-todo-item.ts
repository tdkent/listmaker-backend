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
    if (!checkRequestBody(req.body, NewItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { itemName } = <NewTodoReqInt>req.body;

    // check auth & list type
    const { rows: checkAuth }: { rows: { listType: string }[] } = await db.query(
      `
    SELECT list_type AS "listType" FROM lists
    WHERE list_id = $1 AND user_id = $2;
    `,
      [Number(listId), userId]
    );

    // error handling
    if (!checkAuth.length || checkAuth[0].listType !== AllListTypesEnum.todo) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // has user previously created this item
    const { rows }: { rows: { itemId: number; itemCategory: string }[] } = await db.query(
      `
      SELECT item_category AS "itemCategory"
      FROM items_todo
      WHERE item_name = $1
      AND user_id = $2;
    `,
      [itemName, userId]
    );

    // new item: create new row
    if (!rows.length) {
      await db.query(
        `
        INSERT INTO items_todo (list_id, user_id, item_name)
        VALUES ($1, $2, $3);
        `,
        [Number(listId), userId, itemName]
      );
    }

    // duplicate item: create new row, copy fields from old item
    // TODO: if multiple duplicates exist, fields should be copied from the most recently created
    else {
      await db.query(
        `
        INSERT INTO items_todo (list_id, user_id, item_name, item_category)
        VALUES ($1, $2, $3, $4)
        `,
        [Number(listId), userId, itemName, rows[0].itemCategory]
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
