import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import {
  ShoppingItemEditReqInt,
  ShoppingItemEditReqEnum,
  ShoppingItemInt,
} from "../../models/item";
import { AllListTypesEnum } from "../../models/list";
import editShoppingItem from "./shopping/edit-shopping-item";
import checkRequestBody from "../../utils/check-req-body";
import { RequestErrors } from "../../models/error";

const editItem: RequestHandler<{ listId: string; listType: string; itemId: string }> = async (
  req,
  res,
  next
) => {
  const { userId } = req.user;
  const { listId, itemId } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { listType } = req.body;
    // type: shop
    if (listType === AllListTypesEnum.shop) {
      const updateItem = <ShoppingItemEditReqInt>req.body;

      // check request body
      if (!checkRequestBody(updateItem, ShoppingItemEditReqEnum)) {
        res.status(400);
        return next({ message: reqError.badRequest() });
      }

      // db request
      const result: { id: number }[] = await editShoppingItem(itemId, listId, userId, updateItem);

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

export default editItem;
