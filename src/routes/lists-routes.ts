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
// TODO: add auth check route
// TODO: update route read userId from token instead of params
router.get("/:userId", fetchAllLists);

//? TODO: update this post's routing. Should it use params for :listId?
// GET /lists/single
router.get("/:listId", fetchList);

// POST /lists/new
router.post(
  "/new",
  body("name").not().isEmpty().trim().escape(),
  body("type").isIn(Object.values(ListTypesEnum)),
  createNewList
);

export default router;
