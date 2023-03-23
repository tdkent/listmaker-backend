import { Router } from "express";
import { body, check } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import fetchUserProfile from "../controllers/users/fetch-user-profile";
import editUserProfile from "../controllers/users/edit-user-profile";

const router = Router();

// auth check
router.use(checkToken);

// fetch user profile
router.get("/profile", fetchUserProfile);

// edit user profile
router.patch("/profile", body("userNickname").not().isEmpty().trim().escape(), editUserProfile);

export default router;
