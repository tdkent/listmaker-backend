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
  const { listId, itemId, listType } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // type: shop
    if (listType === AllListTypesEnum.shop) {
      // check request body
      if (!checkRequestBody(req.body, ShoppingItemEditReqEnum)) {
        res.status(400);
        return next({ message: reqError.badRequest() });
      }

      // db request
      const { name, category, isChecked } = <ShoppingItemEditReqInt>req.body;
      const result: { id: number }[] = await editShoppingItem(
        itemId,
        listId,
        userId,
        name,
        category,
        isChecked
      );

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
