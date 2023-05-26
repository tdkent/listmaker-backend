import { Router } from "express";
import { body, param } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import fetchAllLists from "../controllers/lists/fetch-all-lists";
import fetchList from "../controllers/lists/fetch-single-list";
import newList from "../controllers/lists/new-list";
import editList from "../controllers/lists/edit-list";
import deleteList from "../controllers/lists/delete-list";
import { AllListTypesEnum } from "../models/list";
import { ValidatorErrors } from "../models/error";

const router = Router();
const errors = new ValidatorErrors();

// auth check
router.use(checkToken);

// FETCH ALL LISTS /list/fetch
router.get("/fetch", fetchAllLists);

// FETCH SINGLE LIST /list/fetch/:listId
router.get("/fetch/:listId", param("listId", errors.badRequest()).isNumeric(), fetchList);

// NEW LIST /list/new
router.post(
  "/new",
  body("listName")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("Name"))
    .isLength({ max: 18 })
    .withMessage(errors.maxLength("Name", 18))
    .trim(),
  body("listType", errors.invalidField()).isIn(Object.values(AllListTypesEnum)),
  newList
);

// EDIT LIST /list/edit/:listId
router.patch(
  "/edit/:listId",
  param("listId", errors.badRequest()).isNumeric(),
  body("listName")
    .isString()
    .withMessage(errors.invalidField())
    .isLength({ max: 18 })
    .withMessage(errors.maxLength("Name", 18))
    .not()
    .isEmpty()
    .withMessage(errors.nullField("Name"))
    .trim(),
  editList
);

// DELETE LIST /list/delete/:listId
router.delete("/delete/:listId", param("listId", errors.badRequest()).isNumeric(), deleteList);

export default router;
