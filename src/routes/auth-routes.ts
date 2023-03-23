import { Router } from "express";
import { body } from "express-validator";

import register from "../controllers/auth/register";
import login from "../controllers/auth/login";

const router = Router();

// register user
router.post(
  "/register",
  body("userEmail").isEmail(),
  body("userPassword").isLength({ min: 4 }),
  register
);

// login user
router.post(
  "/login",
  body("userEmail").isEmail(),
  body("userPassword").isLength({ min: 4 }),
  login
);

export default router;
