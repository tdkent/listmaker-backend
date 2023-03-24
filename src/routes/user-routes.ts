import { Router } from "express";

import checkToken from "../controllers/auth/check-token";
import fetchUserProfile from "../controllers/users/fetch-user-profile";
import editUserProfile from "../controllers/users/edit-user-profile";

const router = Router();

// auth check
router.use(checkToken);

// fetch user profile
router.get("/profile", fetchUserProfile);

// edit user profile
router.patch("/profile", editUserProfile);

export default router;
