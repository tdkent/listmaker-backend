import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { EditShopItemReqInt, EditShopItemReqEnum } from "../../../models/item";
import checkRequestBody from "../../../utils/check-req-body";
import { RequestErrors } from "../../../models/error";
import db from "../../../db";

const editShoppingItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqBody = <EditShopItemReqInt>req.body;
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
    if (!isChecked[0].isChecked) {
      await db.query(
        `
      UPDATE items_shopping
      SET name = $1, perm_category = $2, temp_category = $2
      WHERE id = $3 AND "listId" = $4 AND "userId" = $5;
      `,
        [reqBody.name, reqBody.category, reqBody.itemId, reqBody.listId, userId]
      );
    } else {
      await db.query(
        `
      UPDATE items_shopping
      SET name = $1, perm_category = $2
      WHERE id = $3 AND "listId" = $4 AND "userId" = $5;
      `,
        [reqBody.name, reqBody.category, reqBody.itemId, reqBody.listId, userId]
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
