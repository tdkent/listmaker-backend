import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { ListTypesEnum } from "../../models/list";
import { ShoppingItemInt } from "../../models/item";
import createShoppingItem from "../items/shopping/create-shopping-item";

const addNewItem: RequestHandler<{ listId: number }> = async (req, res, next) => {
  try {
    //! TODO: add category field to shopping list table
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // determine list type
    const { rows }: { rows: { type: string }[] } = await db.query(
      `
    SELECT type FROM lists
    WHERE id = $1
    AND "userId" = $2;
    `,
      [req.params.listId, req.user.userId]
    );
    if (!rows.length) {
      res.status(401);
      return next({
        message: `Unable to add item to list (id ${req.params.listId}). The list may no longer exist, or you may not be authorized.`,
      });
    }
    const newItem = <ShoppingItemInt>req.body;
    // use list type to execute item creator
    //? use a switch method instead
    if (rows[0].type === ListTypesEnum.shop) {
      await createShoppingItem(req.params.listId, newItem);
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
