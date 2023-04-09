import { Router } from "express";
import { body, param } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import fetchAllLists from "../controllers/lists/fetch-all-lists";
import fetchList from "../controllers/lists/fetch-single-list";
import createNewList from "../controllers/lists/create-new-list";
import editList from "../controllers/lists/edit-list";
import deleteList from "../controllers/lists/delete-list";
import { AllListTypesEnum } from "../models/list";
import { ValidatorErrors } from "../models/error";

const router = Router();
const errors = new ValidatorErrors();

// auth check
router.use(checkToken);

// GET /list/fetch
router.get("/fetch", fetchAllLists);

// GET /list/fetch/:listId
router.get("/fetch/:listId", param("listId", errors.badRequest()).isNumeric(), fetchList);

// POST /list/new
router.post(
  "/new",
  body("name")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .isLength({ max: 24 })
    .withMessage(errors.maxLength("name", 24))
    .trim()
    .escape(),
  body("type", errors.invalidField()).isIn(Object.values(AllListTypesEnum)),
  createNewList
);

// PATCH /list/edit/:listId
router.patch(
  "/edit/:listId",
  param("listId", errors.badRequest()).isNumeric(),
  // NOTE: request body will eventually have additional fields
  body("name")
    .isString()
    .withMessage(errors.invalidField())
    .isLength({ max: 24 })
    .withMessage(errors.maxLength("name", 24))
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim()
    .escape(),
  editList
);

// DELETE /list/delete/:listId
router.delete("/delete/:listId", param("listId", errors.badRequest()).isNumeric(), deleteList);

export default router;
