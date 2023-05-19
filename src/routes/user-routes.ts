import { Router } from "express";
import { body } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import fetchUserProfile from "../controllers/users/fetch-user-profile";
import editUserNickname from "../controllers/users/edit-user-nickname";
import { ValidatorErrors } from "../models/error";

const router = Router();
const errors = new ValidatorErrors();

// auth check
router.use(checkToken);

// fetch user profile
router.get("/profile", fetchUserProfile);

// EDIT NICKNAME: PATCH /user/nickname
router.patch(
  "/nickname",
  body("userNickname")
    .isString()
    .withMessage(errors.invalidField())
    .isLength({ max: 24 })
    .withMessage(errors.maxLength("nickname", 24))
    .trim(),
  editUserNickname
);

export default router;
