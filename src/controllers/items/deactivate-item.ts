import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { AllListTypesEnum } from "../../models/list";
import deactivateShoppingItem from "./shopping/deactivate-shopping-item";
import { RequestErrors } from "../../models/error";
import checkRequestBody from "../../utils/check-req-body";
import { ShoppingItemDeactReqEnum } from "../../models/item";

const deactivateItem: RequestHandler<{ listId: string; itemId: string }> = async (
  req,
  res,
  next
) => {
  const { listId, itemId } = req.params;
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, ShoppingItemDeactReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { listType } = <{ listType: string }>req.body;

    // filter by list type
    if (listType === AllListTypesEnum.shop) {
      // db query
      const result: { id: number }[] = await deactivateShoppingItem(itemId, listId, userId);

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

export default deactivateItem;
