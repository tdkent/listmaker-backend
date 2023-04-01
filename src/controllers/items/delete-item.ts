import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { ListTypesEnum } from "../../models/list";
import deleteShoppingItem from "./shopping/delete-shopping-item";
import { RequestErrors } from "../../models/error";

const deleteItem: RequestHandler<{ listId: string; listType: string; itemId: string }> = async (
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
      return res.status(401).json({ errors: errors.array() });
    }

    // type: shop
    if (listType === ListTypesEnum.shop) {
      // db query
      const result: { id: number }[] = await deleteShoppingItem(itemId, listId, userId);

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
    next({ message: reqError.internalServer() });
  }
};

export default deleteItem;
