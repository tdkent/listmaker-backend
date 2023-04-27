import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import { CheckShoppingItemReqInt, CheckShoppingItemReqEnum } from "../../../models/item";
import db from "../../../db";

const checkShoppingItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const { itemId, listId } = <CheckShoppingItemReqInt>req.body;
  try {
    const reqError = new RequestErrors();
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, CheckShoppingItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // check auth & isChecked
    const { rows: isChecked }: { rows: { isChecked: boolean }[] } = await db.query(
      `
    SELECT is_checked AS "isChecked"
    FROM items_shopping
    WHERE shop_item_id = $1
    AND list_id = $2
    AND user_id = $3;
    `,
      [itemId, listId, userId]
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
      SET is_checked = false, temp_category = perm_category
      WHERE shop_item_id = $1 AND list_id = $2 AND user_id = $3;
      `,
        [itemId, listId, userId]
      );
    } else {
      await db.query(
        `
      UPDATE items_shopping
      SET is_checked = true, temp_category = '_checked'
      WHERE shop_item_id = $1 AND list_id = $2 AND user_id = $3;
      `,
        [itemId, listId, userId]
      );
    }

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    return next({
      message: `An error occurred while attempting to edit item (id ${itemId})`,
    });
  }
};

export default checkShoppingItem;
