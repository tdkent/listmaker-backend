import { Router } from "express";
import { body } from "express-validator";

import register from "../controllers/auth/register";
import login from "../controllers/auth/login";

const router = Router();

// register user
router.post(
  "/register",
  body("userEmail", "Please enter a valid email address and try again")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body("userPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches("[A-Z]")
    .withMessage("Password must contain at least 1 uppercase letter")
    .matches("[0-9]")
    .withMessage("Password must contain at least 1 number"),
  register
);

// login user
router.post(
  "/login",
  body("userEmail", "Please enter a valid email address and try again.")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body("userPassword", "The password field cannot be blank, please try again.").not().isEmpty(),
  login
);

export default router;
