import { Router } from "express";

import fetchUserLists from "../controllers/lists/fetch-lists";

const router = Router();

// fetch user's lists
router.get("/:userId", fetchUserLists);

export default router;
