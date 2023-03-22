"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fetch_lists_1 = __importDefault(require("../controllers/lists/fetch-lists"));
const router = (0, express_1.Router)();
// fetch user's lists
router.get("/:userId", fetch_lists_1.default);
exports.default = router;
