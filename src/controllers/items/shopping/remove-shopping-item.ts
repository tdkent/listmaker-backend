import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RemoveShopItemReqInt, RemoveShopItemReqEnum } from "../../../models/item";
import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import db from "../../../db";

const removeShoppingItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;

  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, RemoveShopItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { listId, itemId } = <RemoveShopItemReqInt>req.body;

    // db query
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    UPDATE items_shopping
    SET is_active = NOT is_active
    WHERE shop_item_id = $1
    AND list_id = $2
    AND user_id = $3
    RETURNING shop_item_id;
    `,
      [itemId, listId, userId]
    );

    // null result error
    if (!rows.length) {
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

export default removeShoppingItem;
