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

    await db.query(
      `
    INSERT INTO items_todo (list_id, user_id, item_name, item_category)
    VALUES (
      $1,
      $2,
      $3::VARCHAR,
      COALESCE((SELECT item_category
          FROM items_todo
          WHERE LOWER(item_name) = LOWER($3) AND user_id = $2
          ORDER BY date_updated DESC LIMIT 1
        ), 'Home')
      );
    `,
      [Number(listId), userId, itemName]
    );

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
