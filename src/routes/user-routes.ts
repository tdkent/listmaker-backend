import { Router } from "express";
import { body } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import fetchUserProfile from "../controllers/users/fetch-user-profile";
import editUserNickname from "../controllers/users/edit-user-nickname";
import editUserPassword from "../controllers/users/edit-user-password";
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
    .isLength({ max: 18 })
    .withMessage(errors.maxLength("nickname", 18))
    .trim(),
  editUserNickname
);

// EDIT PASSWORD: PATCH /user/password
router.patch(
  "/password",
  body("newPassword")
    .isString()
    .withMessage(errors.invalidField())
    .isLength({ min: 8 })
    .matches("[a-z]")
    .withMessage("Password requires at least 1 lower case letter")
    .matches("[A-Z]")
    .withMessage("Password requires at least 1 upper case letter")
    .matches("[0-9]")
    .withMessage("Password requires at least 1 number")
    .matches("[*@#^&$!%]")
    .withMessage("Password requires at least 1 symbol"),
  editUserPassword
);

export default router;
