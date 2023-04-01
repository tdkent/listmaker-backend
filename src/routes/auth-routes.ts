import { Router } from "express";
import { body } from "express-validator";

import register from "../controllers/auth/register";
import login from "../controllers/auth/login";
import { ValidatorErrors } from "../models/error";

const router = Router();
const error = new ValidatorErrors();

// register user
router.post(
  "/register",
  body("userEmail", error.invalidField()).isEmail().trim().escape().normalizeEmail(),
  body("userNickname")
    .isString()
    .withMessage(error.invalidField())
    .isLength({ max: 24 })
    .withMessage(error.maxLength("nickname", 24))
    .trim()
    .escape(),
  body("userPassword")
    .isString()
    .withMessage(error.invalidField())
    .isLength({ min: 8 })
    .withMessage(error.invalidPassword(8, "characters"))
    .matches("[A-Z]")
    .withMessage(error.invalidPassword(1, "uppercase letter"))
    .matches("[0-9]")
    .withMessage(error.invalidPassword(1, "number")),
  register
);

// login user
router.post(
  "/login",
  body("userEmail", error.invalidField()).isEmail().trim().escape().normalizeEmail(),
  body("userPassword")
    .isString()
    .withMessage(error.invalidField())
    .isLength({ min: 8 })
    .withMessage(error.invalidPassword(8, "characters")),
  login
);

export default router;
