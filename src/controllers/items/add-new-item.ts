import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { AllListTypesEnum } from "../../models/list";
import { NewItemReqEnum, NewItemReqInt } from "../../models/item";
import createShoppingItem from "./shopping/create-shopping-item";
import createTodoItem from "./to-do/create-todo-item";
import { RequestErrors } from "../../models/error";
import checkRequestBody from "../../utils/check-req-body";

const addNewItem: RequestHandler<{ listId: string }> = async (req, res, next) => {
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
    const newItem = <NewItemReqInt>req.body;
    if (!checkRequestBody(newItem, NewItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // check auth & list type
    const { rows }: { rows: { type: string }[] } = await db.query(
      `
    SELECT type FROM lists
    WHERE id = $1
    AND "userId" = $2;
    `,
      [Number(listId), userId]
    );

    // null result error
    if (!rows.length) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // filter by list type
    if (rows[0].type === AllListTypesEnum.shop) {
      await createShoppingItem(listId, userId, newItem.name);
    }
    if (rows[0].type === AllListTypesEnum.todo) {
      await createTodoItem(listId, userId, newItem.name);
    }
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default addNewItem;
