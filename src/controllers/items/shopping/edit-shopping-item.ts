import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { EditShopItemReqInt, EditShopItemReqEnum } from "../../../models/shopping";
import checkRequestBody from "../../../utils/check-req-body";
import { RequestErrors } from "../../../models/error";
import db from "../../../db";

const editShoppingItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const { listId, itemId, itemName, itemCategory } = <EditShopItemReqInt>req.body;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, EditShopItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // check auth & isChecked
    const { rows: isChecked }: { rows: { isChecked: boolean }[] } = await db.query(
      `
    SELECT is_checked
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
    if (!isChecked[0].isChecked) {
      await db.query(
        `
      UPDATE items_shopping
      SET
        item_name = $1,
        perm_category = $2,
        temp_category = $2
      WHERE shop_item_id = $3
      AND list_id = $4
      AND user_id = $5;
      `,
        [itemName, itemCategory, itemId, listId, userId]
      );
    } else {
      await db.query(
        `
      UPDATE items_shopping
      SET
        item_name = $1,
        perm_category = $2
      WHERE shop_item_id = $3
      AND list_id = $4
      AND user_id = $5;
      `,
        [itemName, itemCategory, itemId, listId, userId]
      );
    }

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({ message: reqError.internalServer() });
  }
};

export default editShoppingItem;
