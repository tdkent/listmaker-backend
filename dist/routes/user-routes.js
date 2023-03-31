"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const check_token_1 = __importDefault(require("../controllers/auth/check-token"));
const fetch_user_profile_1 = __importDefault(require("../controllers/users/fetch-user-profile"));
const edit_user_profile_1 = __importDefault(require("../controllers/users/edit-user-profile"));
const router = (0, express_1.Router)();
// auth check
router.use(check_token_1.default);
// fetch user profile
router.get("/profile", fetch_user_profile_1.default);
// edit user profile
router.patch("/profile", 
//! Note: Request body will eventually contain additional fields
(0, express_validator_1.body)("userNickname")
    .isString()
    .withMessage("Your nickname is improperly formatted. Please try again.")
    .isLength({ max: 24 })
    .withMessage("Please make sure your nickname length is 24 characters or less.")
    .trim()
    .escape(), edit_user_profile_1.default);
exports.default = router;
