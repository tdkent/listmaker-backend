import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { CheckTypesEnum } from "../../models/list";

const checkItem: RequestHandler<{ listId: string; listType: string; itemId: string }> = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    const { listId, listType, itemId } = req.params;
    if (listType === CheckTypesEnum.shop) {
    }
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    return next({
      message: `An error occurred while attempting to edi`,
    });
  }
};

export default checkItem;
