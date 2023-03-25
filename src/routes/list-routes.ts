import { Router } from "express";
import { body } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import fetchAllLists from "../controllers/lists/fetch-all-lists";
import fetchList from "../controllers/lists/fetch-single-list";
import createNewList from "../controllers/lists/create-new-list";
import editList from "../controllers/lists/edit-list";
import deleteList from "../controllers/lists/delete-list";
import { ListTypesEnum } from "../models/lists";

const router = Router();

// auth check
router.use(checkToken);

// GET /lists/all
router.get("/fetch", fetchAllLists);

// GET /lists/single/:listId
router.get("/fetch/:listId", fetchList);

// POST /lists/new
router.post(
  "/new",
  body("name", "Please enter a list name and try again.").not().isEmpty().trim().escape(),
  body("type", "Please select a valid list type and try again.").isIn(Object.values(ListTypesEnum)),
  createNewList
);

// PATCH /lists/edit/:listId
router.patch(
  "/edit/:listId",
  body("name", "Please enter a list name and try again.").not().isEmpty().trim().escape(),
  editList
);

// DELETE /lists/delete/:listId
router.delete("/delete/:listId", deleteList);

export default router;
