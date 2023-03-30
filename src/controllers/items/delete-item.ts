import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { ListTypesEnum } from "../../models/list";
import deleteShoppingItem from "./shopping/delete-shopping-item";

const deleteItem: RequestHandler<{ listId: string; listType: string; itemId: string }> = async (
  req,
  res,
  next
) => {
  const { listId, listType, itemId } = req.params;
  const { userId } = req.user;
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    let success = false;

    // filter list type
    if (listType === ListTypesEnum.shop) {
      const result = await deleteShoppingItem(itemId, listId, userId);
      if (result.length) success = true;
    }

    // null result error
    if (!success) {
      res.status(401);
      return next({
        message: `Unable to delete item (id ${itemId}). The item or list may no longer exist, or you may not be authorized.`,
      });
    }

    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: `An error occurred while attempting to delete item (id ${itemId})`,
    });
  }
};

export default deleteItem;
