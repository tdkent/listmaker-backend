import { Router } from "express";
import { body } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import addNewItem from "../controllers/lists/add-new-item";

const router = Router();

// auth check
router.use(checkToken);

// POST /item/new/:listId
// TODO: validation: item must have a name. trim and escape the name.
router.post(
  "/new/:listId",
  body("name", "Name field cannot be blank.").not().isEmpty().trim().escape(),
  addNewItem
);

// this route will update the entire resource. Can be used for any instance of an item being updated (ie, user checks the item, or edits the item's name.)
// PUT /item/:listId/:itemId

// DELETE /item/:listId/:itemId

export default router;
