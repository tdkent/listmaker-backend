"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fetch_user_profile_1 = __importDefault(require("../controllers/users/fetch-user-profile"));
const router = (0, express_1.Router)();
router.get("/:userId", fetch_user_profile_1.default);
exports.default = router;
