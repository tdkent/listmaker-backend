import { Router } from "express";

import fetchList from "../controllers/list/fetch-list";

const router = Router();

// fetch single list
router.get("/:listId", fetchList);

export default router;
