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

// PATCH /item/:listId/:itemId/check
router.patch(
  "/:listId/:itemId/check",
  param("listId", errors.badRequest()).isNumeric(),
  param("itemId", errors.badRequest()).isNumeric(),
  body("listType", errors.invalidField()).isIn(Object.values(CheckableListTypesEnum)),
  checkItem
);

// PATCH /item/:listId/:itemId/:listType
router.patch(
  "/:listId/:itemId/:listType",
  param("listId", errors.badRequest()).isNumeric(),
  param("itemId", errors.badRequest()).isNumeric(),
  param("listType", errors.invalidField()).isIn(Object.values(AllListTypesEnum)),
  body("name")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim(),
  // TODO: what is the correct way to filter user input?
  // .escape(),
  editItem
);

// DELETE /item/:listId/:listType/:itemId
router.delete(
  "/:listId/:listType/:itemId",
  param("listId", errors.badRequest()).isNumeric(),
  param("listType", errors.invalidField()).isIn(Object.values(AllListTypesEnum)),
  param("itemId", errors.badRequest()).isNumeric(),
  deleteItem
);

export default router;
