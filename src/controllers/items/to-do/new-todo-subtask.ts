import { RequestHandler } from "express";

import { RequestErrors } from "../../../models/error";

const newTodoSubtask: RequestHandler<{ listId: string }> = (req, res, next) => {
  const { userId } = req.user;
  const { listId } = req.params;
  console.log("listId: ", listId);
  console.log("userId: ", userId);
  const reqError = new RequestErrors();
  try {
    console.log(req.body);
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default newTodoSubtask;
