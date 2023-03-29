import { Router } from "express";
import { body } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import addNewItem from "../controllers/items/add-new-item";
import editItem from "../controllers/items/edit-item";

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

// PUT /item/edit/:itemId
// router.patch(
//   "/edit/:listId/:itemId",
//   body("name", "Name field cannot be blank.").not().isEmpty().trim().escape(),
//   editItem
// );

router.patch(
  "/:listId/:listType/:itemId",
  // NOTE: assumes all item types will have a required name field
  body("name", "Name field cannot be blank.").not().isEmpty().trim().escape(),
  editItem
);

// DELETE /item/:listId/:itemId

export default router;
