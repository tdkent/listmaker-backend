import { Router } from "express";

import fetchUserProfile from "../controllers/users/fetch-user-profile";

const router = Router();

router.get("/:userId", fetchUserProfile);

export default router;
