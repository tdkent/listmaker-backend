import { Router } from "express";

import registerUser from "../controllers/auth/register-user";

const router = Router();

// register user
router.post("/register", registerUser);

// login user

export default router;
