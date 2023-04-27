import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../../db";
import { AllListTypesEnum } from "../../../models/list";
import { NewItemReqEnum, NewItemReqInt, NewShoppingItemReqEnum } from "../../../models/item";
import { NewShopItemReqInt, NewShopItemReqEnum } from "../../../models/shopping";
import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";

const newShoppingItem: RequestHandler<{ listId: string }> = async (req, res, next) => {
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
    if (!checkRequestBody(req.body, NewShoppingItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { itemName } = <NewShopItemReqInt>req.body;

    // check auth & list type
    const { rows: checkAuth }: { rows: { listType: string }[] } = await db.query(
      `
    SELECT
      list_type AS "listType"
    FROM lists
    WHERE list_id = $1 AND user_id = $2;
    `,
      [Number(listId), userId]
    );

    // error handling
    if (!checkAuth.length || checkAuth[0].listType !== AllListTypesEnum.shop) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // check to see if the item exists & isChecked, isActive values
    const { rows }: { rows: { isChecked: boolean; isActive: boolean }[] } = await db.query(
      `
      SELECT
        is_checked AS "isChecked",
        is_active AS "isActive"
      FROM items_shopping
      WHERE item_name = $1
      AND list_id = $2
      AND user_id = $3;
    `,
      [itemName, Number(listId), userId]
    );

    // new item: create new row
    if (!rows.length) {
      await db.query(
        `
        INSERT INTO items_shopping (list_id, user_id, item_name)
        VALUES ($1, $2, $3);
        `,
        [Number(listId), userId, itemName]
      );
    }

    // current item & checked: uncheck
    else if (rows[0].isChecked) {
      await db.query(
        `
        UPDATE items_shopping
        SET is_checked = false, temp_category = perm_category
        WHERE item_name = $1 AND list_id = $2 AND user_id = $3
        `,
        [itemName, Number(listId), userId]
      );
    }

    // previous item & inactive: reactivate item
    else if (!rows[0].isActive) {
      await db.query(
        `
      UPDATE items_shopping
      SET is_active = true
      WHERE item_name = $1 AND list_id = $2 AND user_id = $3
      `,
        [itemName, Number(listId), userId]
      );
    }

    // previous item & active: ignore request
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

export default newShoppingItem;
