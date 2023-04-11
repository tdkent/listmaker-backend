import { Router } from "express";
import { body, param } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import addNewItem from "../controllers/items/add-new-item";
import editItem from "../controllers/items/edit-item";
import checkItem from "../controllers/items/check-item";
import deleteItem from "../controllers/items/delete-item";
import { AllListTypesEnum, CheckableListTypesEnum } from "../models/list";
import { ValidatorErrors } from "../models/error";

const router = Router();
const errors = new ValidatorErrors();

// auth check
router.use(checkToken);

//! NOTE: all item types will have a required name field

// POST /item/new/:listId
router.post(
  "/new/:listId",
  param("listId", errors.badRequest()).isNumeric(),
  body("name")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim()
    .escape(),
  addNewItem
);

// PATCH /item/check/:listId/:itemId/
router.patch(
  "/check/:listId/:itemId",
  param("listId", errors.badRequest()).isNumeric(),
  param("itemId", errors.badRequest()).isNumeric(),
  // TODO: this should be based on an enum
  body("listType", errors.invalidField()).isIn(["shopping"]),
  checkItem
);

// PATCH /item/:listId/:itemId
router.patch(
  "/:listId/:itemId",
  param("listId", errors.badRequest()).isNumeric(),
  param("itemId", errors.badRequest()).isNumeric(),
  body("listType").isIn(["shopping"]),
  body("name")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim()
    .escape(),
  editItem
);

// DELETE /item/:listId/:listType/:itemId
router.delete(
  "/:listId/:listType/:itemId",
  param("listId", errors.badRequest()).isNumeric(),
  param("listType", errors.invalidField()).isIn(Object.keys(AllListTypesEnum)),
  param("itemId", errors.badRequest()).isNumeric(),
  deleteItem
);

export default router;
