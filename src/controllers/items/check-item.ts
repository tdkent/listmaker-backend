import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { CheckableListTypesEnum } from "../../models/list";
import checkShoppingItem from "./shopping/check-shopping-item";
import checkTodoItem from "./to-do/check-todo-item";
import { RequestErrors } from "../../models/error";

const checkItem: RequestHandler<{ listId: string; listType: string; itemId: string }> = async (
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
      return res.status(400).json({ errors: errors.array() });
    }

    // filter by list type
    // TODO: type request body object
    const { listType, isChecked }: { listType: string; isChecked: boolean } = req.body;

    if (listType === CheckableListTypesEnum.shop) {
      // db query
      const result: { id: number }[] = await checkShoppingItem(itemId, isChecked, listId, userId);

      // null result error
      if (!result.length) {
        res.status(401);
        return next({ message: reqError.nullResult() });
      }
    }

    if (listType === CheckableListTypesEnum.todo) {
      // db query
      const result: { id: number }[] = await checkTodoItem(itemId, isChecked, listId, userId);

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
