import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../../db";
import {
  NewShopItemReqInt,
  NewShopItemReqEnum,
} from "../../../models/shopping";
import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";

const newShoppingItem: RequestHandler<{ listId: string }> = async (
  req,
  res,
  next
) => {
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
    if (!checkRequestBody(req.body, NewShopItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { itemName } = <NewShopItemReqInt>req.body;

    // db query
    const { rows }: { rows: { newShopping: boolean }[] } = await db.query(
      `SELECT "newShopping" ($1, $2, $3)`,
      [listId, userId, itemName]
    );

    // null result error
    if (!rows[0].newShopping) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default newShoppingItem;
