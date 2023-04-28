import { Router } from "express";
import { body, param } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import { ValidatorErrors } from "../models/error";
import { TodoCatsEnum } from "../models/todo";
import newTodoItem from "../controllers/items/to-do/new-todo-item";
import checkTodoItem from "../controllers/items/to-do/check-todo-item";
import removeTodoItem from "../controllers/items/to-do/remove-todo-item";
import editTodoItem from "../controllers/items/to-do/edit-todo-item";

const router = Router();
const errors = new ValidatorErrors();

// auth check
router.use(checkToken);

// NEW ITEM "/todo/:listId"
router.post(
  "/:listId",
  param("listId", errors.badRequest()).isNumeric(),
  body("itemName")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim(),
  newTodoItem
);

// CHECK ITEM: PATCH /todo/check
router.patch(
  "/check",
  body("listId", errors.badRequest()).isNumeric(),
  body("itemId", errors.badRequest()).isNumeric(),
  checkTodoItem
);

// EDIT ITEM: PATCH /todo/edit
router.patch(
  "/edit",
  body("listId", errors.badRequest()).isNumeric(),
  body("itemId", errors.badRequest()).isNumeric(),
  body("itemName")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim(),
  body("itemCategory", errors.invalidField()).isIn(Object.values(TodoCatsEnum)),
  body("itemDate")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name")),
  editTodoItem
);

// REMOVE ITEM: PATCH /todo/remove
router.patch(
  "/remove",
  body("listId", errors.badRequest()).isNumeric(),
  body("itemId", errors.badRequest()).isNumeric(),
  removeTodoItem
);

export default router;
