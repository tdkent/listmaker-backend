import { Router } from "express";
import { body } from "express-validator";

import registerUser from "../controllers/auth/register-user";

const router = Router();

// register user
router.post(
  "/register",
  body("userEmail").isEmail(),
  body("userPassword").isLength({ min: 4 }),
  registerUser
);

// login user

export default router;
