"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const fetch_user_profile_1 = __importDefault(require("../controllers/users/fetch-user-profile"));
const edit_user_profile_1 = __importDefault(require("../controllers/users/edit-user-profile"));
const router = (0, express_1.Router)();
// fetch user profile
router.get("/:userId", fetch_user_profile_1.default);
// edit user profile
router.patch("/:userId", (0, express_validator_1.body)("userNickname").not().isEmpty().trim().escape(), edit_user_profile_1.default);
exports.default = router;
