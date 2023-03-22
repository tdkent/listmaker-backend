import { Router } from "express";
import { body } from "express-validator";

import fetchUserProfile from "../controllers/users/fetch-user-profile";
import editUserProfile from "../controllers/users/edit-user-profile";

const router = Router();

// fetch user profile
router.get("/:userId", fetchUserProfile);

// edit user profile
router.patch("/:userId", body("userNickname").not().isEmpty().trim().escape(), editUserProfile);

export default router;
