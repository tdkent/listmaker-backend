import { Router } from "express";
import { body, param } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import { ValidatorErrors } from "../models/error";
import { TodoCatsEnum, RecurReqEnum, recurValArr } from "../models/todo";
import newTodoItem from "../controllers/items/to-do/new-todo-item";
import checkTodoItem from "../controllers/items/to-do/check-todo-item";
import removeTodoItem from "../controllers/items/to-do/remove-todo-item";
import editTodoItem from "../controllers/items/to-do/edit-todo-item";
import newSubtask from "../controllers/items/to-do/new-todo-subtask";
import checkSubtask from "../controllers/items/to-do/check-todo-subtask";
import editSubtask from "../controllers/items/to-do/edit-todo-subtask";
import deleteSubtask from "../controllers/items/to-do/delete-todo-subtask";

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
  body("itemLocation", errors.invalidField()).isString().trim(),
  body("itemDate").isISO8601().withMessage(errors.invalidField()),
  body("itemTime", errors.invalidField())
    .isTime({ hourFormat: "hour24", mode: "withSeconds" })
    // this field may be an empty string
    .optional({ checkFalsy: true }),
  body("isRecurring", errors.invalidField()).isBoolean(),
  body("recurInteger", errors.invalidField()).isIn(recurValArr(10)).optional({ checkFalsy: true }),
  body("recurInterval", errors.invalidField())
    .isIn(Object.values(RecurReqEnum))
    .optional({ checkFalsy: true }),
  editTodoItem
);

// REMOVE ITEM: PATCH /todo/remove
router.patch(
  "/remove",
  body("listId", errors.badRequest()).isNumeric(),
  body("itemId", errors.badRequest()).isNumeric(),
  removeTodoItem
);

// NEW SUBTASK: POST /todo/:listId/subtask
router.post(
  "/:listId/subtask",
  param("listId", errors.badRequest()).isNumeric(),
  body("itemId", errors.badRequest()).isNumeric(),
  body("taskName")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim(),
  newSubtask
);

// CHECK SUBTASK: PATCH /todo/:itemId/subtask/check
router.patch(
  "/subtask/check",
  body("itemId", errors.badRequest()).isNumeric(),
  body("taskId", errors.badRequest()).isNumeric(),
  checkSubtask
);

// EDIT SUBTASK: PATCH /todo/:itemId/subtask
router.patch(
  "/:itemId/subtask",
  param("itemId", errors.badRequest()).isNumeric(),
  body("taskId", errors.badRequest()).isNumeric(),
  body("newName")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim(),
  editSubtask
);

// DELETE SUBTASK: DELETE /todo/:listId/subtask
router.delete(
  "/:itemId/subtask/:taskId",
  param("itemId", errors.badRequest()).isNumeric(),
  param("taskId", errors.badRequest()).isNumeric(),
  deleteSubtask
);

export default router;
