import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { ListTypesEnum } from "../../models/list";
import { ShoppingItemNewReqEnum, ShoppingItemNewReqInt } from "../../models/item";
import createShoppingItem from "./shopping/create-shopping-item";

const addNewItem: RequestHandler<{ listId: string }> = async (req, res, next) => {
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check that token holder owns the list and determine the list type
    const { rows }: { rows: { type: string }[] } = await db.query(
      `
    SELECT type FROM lists
    WHERE id = $1
    AND "userId" = $2;
    `,
      [req.params.listId, req.user.userId]
    );

    // error on null result
    if (!rows.length) {
      res.status(401);
      return next({
        message: `Unable to add item to list (id ${req.params.listId}). The list may no longer exist, or you may not be authorized.`,
      });
    }

    // list type filtering
    // shopping
    if (rows[0].type === ListTypesEnum.shop) {
      const newItem = <ShoppingItemNewReqInt>req.body;
      // check request body for unwanted fields
      if (Object.keys(newItem).length !== Object.keys(ShoppingItemNewReqEnum).length) {
        return res.status(400).json({
          message: "Malformed request body",
        });
      }
      await createShoppingItem(Number(req.params.listId), Number(req.user.userId), newItem);
    }
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: "An error occurred while creating the new item.",
    });
  }
};

export default addNewItem;
