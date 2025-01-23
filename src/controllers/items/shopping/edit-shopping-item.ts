import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import {
  EditShopItemReqInt,
  EditShopItemReqEnum,
} from "../../../models/shopping";
import checkRequestBody from "../../../utils/check-req-body";
import { RequestErrors, RequestErrorsEnum } from "../../../models/error";
import db from "../../../db";

const editShoppingItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const { listId, itemId, itemName, itemCategory } = <EditShopItemReqInt>(
    req.body
  );
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

    // db query
    const { rows }: { rows: { editShopping: string }[] } = await db.query(
      `SELECT "editShopping" ($1, $2, $3, $4, $5)`,
      [itemId, listId, userId, itemName, itemCategory]
    );

    // errors
    const { editShopping: err } = rows[0];

    if (err === RequestErrorsEnum.null) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    if (err.includes(RequestErrorsEnum.dup)) {
      res.status(422);
      const dupName = err.split(": ")[1];
      return next({ message: reqError.duplicateShopItem(dupName) });
    }

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500);
    next({ message: reqError.internalServer() });
  }
};

export default editShoppingItem;
