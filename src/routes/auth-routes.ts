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
    .isLength({ max: 16 })
    .withMessage(error.maxLength("nickname", 16))
    .trim()
    .escape(),
  body("userPassword", "Password does not meet requirements")
    .isString()
    .withMessage(error.invalidField())
    .isLength({ min: 8 })
    .matches("[a-z]")
    .withMessage("Password requires at least 1 lower case letter")
    .matches("[A-Z]")
    .withMessage("Password requires at least 1 upper case letter")
    .matches("[0-9]")
    .withMessage("Password requires at least 1 number")
    .matches("[*@#^&$!%]")
    .withMessage("Password requires at least 1 symbol: *@#^&$!%"),
  register
);

// login user
router.post(
  "/login",
  body("userEmail", error.invalidField()).isEmail().trim().escape().normalizeEmail(),
  body("userPassword", error.invalidField()).isString(),
  login
);

export default router;
