import { Router } from "express";
import { body } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import fetchAllLists from "../controllers/lists/fetch-all-lists";
import fetchList from "../controllers/lists/fetch-single-list";
import createNewList from "../controllers/lists/create-new-list";
import { ListTypesEnum } from "../models/lists";

const router = Router();

// auth check
router.use(checkToken);

// GET /lists/all
router.get("/all", fetchAllLists);

// GET /lists/single
router.get("/single/:listId", fetchList);

// POST /lists/new
router.post(
  "/new",
  body("name", "Please enter a list name and try again.").not().isEmpty().trim().escape(),
  body("type", "Please select a valid list type and try again.").isIn(Object.values(ListTypesEnum)),
  createNewList
);

export default router;
