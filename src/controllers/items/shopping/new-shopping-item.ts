import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../../db";
import { AllListTypesEnum } from "../../../models/list";
import { NewItemReqEnum, NewItemReqInt } from "../../../models/item";
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
    const reqBody = <NewItemReqInt>req.body;
    if (!checkRequestBody(reqBody, NewItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // check auth & list type
    const { rows: checkAuth }: { rows: { type: string }[] } = await db.query(
      `
    SELECT type FROM lists
    WHERE id = $1 AND "userId" = $2;
    `,
      [Number(listId), userId]
    );

    // error handling
    if (!checkAuth.length || checkAuth[0].type !== AllListTypesEnum.shop) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // check to see if the item exists & isChecked, isActive values
    const { rows }: { rows: { isChecked: boolean; isActive: boolean }[] } = await db.query(
      `
      SELECT "isChecked", "isActive" FROM items_shopping
      WHERE name = $1 AND "listId" = $2 AND "userId" = $3;
    `,
      [reqBody.name, Number(listId), userId]
    );

    // new item: create new row
    if (!rows.length) {
      await db.query(
        `
        INSERT INTO items_shopping ("listId", "userId", name)
        VALUES ($1, $2, $3);
        `,
        [Number(listId), userId, reqBody.name]
      );
    }

    // current item & checked: uncheck
    if (rows[0].isChecked) {
      await db.query(
        `
        UPDATE items_shopping
        SET "isChecked" = false, temp_category = perm_category
        WHERE name = $1 AND "listId" = $2 AND "userId" = $3
        `,
        [reqBody.name, Number(listId), userId]
      );
    }

    // previous item & inactive: reactivate item
    if (!rows[0].isActive) {
      await db.query(
        `
      UPDATE items_shopping
      SET "isActive" = true
      WHERE name = $1 AND "listId" = $2 AND "userId" = $3
      `,
        [reqBody.name, Number(listId), userId]
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
