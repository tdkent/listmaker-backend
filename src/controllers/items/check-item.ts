import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { CheckTypesEnum } from "../../models/list";
import checkShoppingItem from "./shopping/check-shopping-item";
import { RequestErrors } from "../../models/error";

const checkItem: RequestHandler<{ listId: string; listType: string; itemId: string }> = async (
  req,
  res,
  next
) => {
  const { listId, listType, itemId } = req.params;
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // type: shop
    if (listType === CheckTypesEnum.shop) {
      // db query
      const result: { id: number }[] = await checkShoppingItem(itemId, listId, userId);

      // null result error
      if (!result.length) {
        res.status(401);
        return next({ message: reqError.nullResult() });
      }
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
