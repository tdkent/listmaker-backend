import { Router } from "express";
import { body } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import fetchUserProfile from "../controllers/users/fetch-user-profile";
import editUserProfile from "../controllers/users/edit-user-profile";
import { ValidatorErrors } from "../models/error";

const router = Router();
const errors = new ValidatorErrors();

// auth check
router.use(checkToken);

// fetch user profile
router.get("/profile", fetchUserProfile);

// edit user profile
router.patch(
  "/profile",
  //! Note: Request body will eventually contain additional fields
  body("userNickname")
    .isString()
    .withMessage(errors.invalidField())
    .isLength({ max: 24 })
    .withMessage(errors.maxLength("nickname", 24))
    .trim()
    .escape(),
  editUserProfile
);

export default router;
