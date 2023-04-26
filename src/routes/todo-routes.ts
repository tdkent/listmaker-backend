import { Router } from "express";
import { body, param } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import { ValidatorErrors } from "../models/error";
import newTodoItem from "../controllers/items/to-do/new-todo-item";
import checkTodoItem from "../controllers/items/to-do/check-todo-item";
import newShoppingItem from "../controllers/items/shopping/new-shopping-item";
import checkShoppingItem from "../controllers/items/shopping/check-shopping-item";
import editShoppingItem from "../controllers/items/shopping/edit-shopping-item";
import removeShoppingItem from "../controllers/items/shopping/remove-shopping-item";

const router = Router();
const errors = new ValidatorErrors();

// auth check
router.use(checkToken);

// NEW ITEM "/todo/:listId"
router.post(
  "/:listId",
  param("listId", errors.badRequest()).isNumeric(),
  body("name")
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

// EDIT ITEM: PATCH /shopping/edit
router.patch(
  "/edit",
  body("listId", errors.badRequest()).isNumeric(),
  body("itemId", errors.badRequest()).isNumeric(),
  body("name")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim(),
  body("category", errors.invalidField()).isString().trim(),
  editShoppingItem
);

// REMOVE ITEM: PATCH /shopping/remove
router.patch(
  "/remove",
  body("listId", errors.badRequest()).isNumeric(),
  body("itemId", errors.badRequest()).isNumeric(),
  removeShoppingItem
);

export default router;
