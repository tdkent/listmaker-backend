import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { CheckTypesEnum } from "../../models/list";
import checkShoppingItem from "./shopping/check-shopping-item";

const checkItem: RequestHandler<{ listId: string; listType: string; itemId: string }> = async (
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

    // list filtering
    if (listType === CheckTypesEnum.shop) {
      const result = (await checkShoppingItem(itemId, listId, userId)) as { id: number }[];
      if (result.length) success = true;
    }
    if (!success) {
      res.status(401);
      return next({
        message: `Unable to edit item (id ${itemId}). The item or list may no longer exist, or you may not be authorized.`,
      });
    }
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    return next({
      message: `An error occurred while attempting to edit item (id ${itemId})`,
    });
  }
};

export default checkItem;
