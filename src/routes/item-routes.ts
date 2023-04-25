// import express, { Router } from "express";
// import { body, param } from "express-validator";

// import checkToken from "../controllers/auth/check-token";
// import addNewItem from "../controllers/items/add-new-item";
// import editItem from "../controllers/items/edit-item";
// import checkItem from "../controllers/items/check-item";
// import { AllListTypesEnum, CheckableListTypesEnum } from "../models/list";
// import { ValidatorErrors } from "../models/error";

// import shoppingItemRoutes from "./shopping-routes";

// const app = express();
// const router = Router();
// const errors = new ValidatorErrors();

// // auth check
// router.use(checkToken);

// // NEW ITEM: POST /item/new/:listId
// router.post(
//   "/new/:listId",
//   param("listId", errors.badRequest()).isNumeric(),
//   body("name")
//     .isString()
//     .withMessage(errors.invalidField())
//     .not()
//     .isEmpty()
//     .withMessage(errors.nullField("name"))
//     .trim(),
//   addNewItem
// );

// // CHECK ITEM: PATCH /item/:listId/:itemId/check
// router.patch(
//   "/:listId/:itemId/check",
//   param("listId", errors.badRequest()).isNumeric(),
//   param("itemId", errors.badRequest()).isNumeric(),
//   body("listType", errors.invalidField()).isIn(Object.values(CheckableListTypesEnum)),
//   body("isChecked", errors.invalidField()).isBoolean(),
//   checkItem
// );

// // DEACTIVATE ITEM: PATCH /item/:listId/:itemId/delete
// // router.patch(
// //   "/:listId/:itemId/delete",
// //   param("listId", errors.badRequest()).isNumeric(),
// //   param("itemId", errors.badRequest()).isNumeric(),
// //   body("listType", errors.invalidField()).isIn(Object.values(CheckableListTypesEnum)),
// //   deactivateItem
// // );

// // EDIT ITEM: PATCH /item/:listId/:itemId/:listType
// router.patch(
//   "/:listId/:itemId/:listType",
//   param("listId", errors.badRequest()).isNumeric(),
//   param("itemId", errors.badRequest()).isNumeric(),
//   param("listType", errors.invalidField()).isIn(Object.values(AllListTypesEnum)),
//   body("name")
//     .isString()
//     .withMessage(errors.invalidField())
//     .not()
//     .isEmpty()
//     .withMessage(errors.nullField("name"))
//     .trim(),
//   body("category", errors.invalidField()).isString().trim(),
//   body("isChecked", errors.invalidField()).isBoolean(),
//   editItem
// );

// export default router;
