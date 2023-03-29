import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import {
  ShoppingItemEditReqInt,
  ShoppingItemEditReqEnum,
  ShoppingItemInt,
} from "../../models/item";
import { ListTypesEnum } from "../../models/list";
import editShoppingItem from "./shopping/edit-shopping-item";

const editItem: RequestHandler<{ listId: string; listType: string; itemId: string }> = async (
  req,
  res,
  next
) => {
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // filter by list type params
    const listType = req.params.listType;
    if (listType === ListTypesEnum.shop) {
      const updateItem = <ShoppingItemEditReqInt>req.body;
      // check request body
      if (Object.keys(updateItem).length !== Object.keys(ShoppingItemEditReqEnum).length) {
        return res.status(400).json({
          message: "Malformed request body",
        });
      }
      // db request
      const result: ShoppingItemInt[] = await editShoppingItem(
        Number(req.params.itemId),
        Number(req.params.listId),
        Number(req.user.userId),
        updateItem
      );
      // null result error
      if (!result.length) {
        res.status(401);
        return next({
          message: `Unable to add item to list (id ${req.params.listId}). The list may no longer exist, or you may not be authorized.`,
        });
      }
      res.json({ message: "OK" });
    } else {
      return res.status(404).json({ message: "Malformed route parameters" });
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: `An error occurred while attempting to edit the item (list id ${req.params.listId} )`,
    });
  }
};

export default editItem;
