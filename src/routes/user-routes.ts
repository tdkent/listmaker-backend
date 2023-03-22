import { Router } from "express";

import fetchUserProfile from "../controllers/users/fetch-user-profile";
import registerUser from "../controllers/auth/register";

const router = Router();

// fetch user profile
router.get("/:userId", fetchUserProfile);

export default router;
