import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";
import {
  CheckShopItemReqInt,
  CheckShopItemReqEnum,
} from "../../../models/shopping";
import db from "../../../db";

const checkShoppingItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, CheckShopItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { itemId, listId } = <CheckShopItemReqInt>req.body;

    // db query
    const { rows }: { rows: { checkShopping: boolean }[] } = await db.query(
      `SELECT "checkShopping" ($1, $2, $3)`,
      [itemId, listId, userId]
    );

    // null result error
    if (!rows[0].checkShopping) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500);
    return next({
      message: reqError.internalServer(),
    });
  }
};

export default checkShoppingItem;
