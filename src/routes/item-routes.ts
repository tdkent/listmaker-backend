import { Router } from "express";
import { body, param } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import addNewItem from "../controllers/items/add-new-item";
import editItem from "../controllers/items/edit-item";
import checkItem from "../controllers/items/check-item";
import deleteItem from "../controllers/items/delete-item";
import { ListTypesEnum, CheckTypesEnum } from "../models/list";

const router = Router();

// auth check
router.use(checkToken);

// POST /item/new/:listId
router.post(
  "/new/:listId",
  // NOTE: assumes all item types will have a required name field
  body("name", "Name field cannot be blank.").not().isEmpty().trim().escape(),
  addNewItem
);

// PATCH /item/:listId/:listType/:itemId
router.patch(
  "/:listId/:listType/:itemId",
  // NOTE: assumes all item types will have a required name field
  body("name", "Name field cannot be blank.").not().isEmpty().trim().escape(),
  editItem
);

// PATCH /item/check/:listId/:listType/:itemId/
router.patch(
  "/check/:listId/:listType/:itemId",
  param("listId", "Malformed route parameters").matches(/[0-9]/),
  param("itemId", "Malformed router parameters").matches(/[0-9]/),
  param("listType", "Malformed router parameters").isIn(Object.keys(CheckTypesEnum)),
  checkItem
);

// DELETE /item/:listId/:itemId
router.delete(
  "/:listId/:listType/:itemId",
  param("listId", "Malformed route parameters").matches(/[0-9]/),
  param("itemId", "Malformed router parameters").matches(/[0-9]/),
  param("listType", "Malformed route parameters").isIn(Object.keys(ListTypesEnum)),
  deleteItem
);

export default router;
