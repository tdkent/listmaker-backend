import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import { CheckShoppingItemReqInt, CheckShoppingItemReqEnum } from "../../../models/item";
import db from "../../../db";

const checkShoppingItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqBody = <CheckShoppingItemReqInt>req.body;
  try {
    const reqError = new RequestErrors();
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(reqBody, CheckShoppingItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // check auth & isChecked
    const { rows: isChecked }: { rows: { isChecked: boolean }[] } = await db.query(
      `
    SELECT "isChecked" FROM items_shopping
    WHERE id = $1 AND "listId" = $2 AND "userId" = $3;
    `,
      [reqBody.itemId, reqBody.listId, userId]
    );

    // null result error
    if (!isChecked.length) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // db query
    if (isChecked[0].isChecked) {
      await db.query(
        `
      UPDATE items_shopping
      SET "isChecked" = false, temp_category = perm_category
      WHERE id = $1 AND "listId" = $2 AND "userId" = $3
      RETURNING id;
      `,
        [reqBody.itemId, reqBody.listId, userId]
      );
    } else {
      await db.query(
        `
      UPDATE items_shopping
      SET "isChecked" = true, temp_category = '__checked'
      WHERE id = $1 AND "listId" = $2 AND "userId" = $3
      RETURNING id;
      `,
        [reqBody.itemId, reqBody.listId, userId]
      );
    }

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    return next({
      message: `An error occurred while attempting to edit item (id ${reqBody.itemId})`,
    });
  }
};

export default checkShoppingItem;
