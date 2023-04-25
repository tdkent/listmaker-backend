import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RemoveShopItemReqInt, RemoveShopItemReqEnum } from "../../../models/item";
import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import db from "../../../db";

const removeShoppingItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqBody = <RemoveShopItemReqInt>req.body;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(reqBody, RemoveShopItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // db query
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    UPDATE items_shopping
    SET "isActive" = NOT "isActive"
    WHERE id = $1 AND "listId" = $2 AND "userId" = $3
    RETURNING id;
    `,
      [reqBody.itemId, reqBody.listId, userId]
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
