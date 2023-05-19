"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const check_token_1 = __importDefault(require("../controllers/auth/check-token"));
const fetch_user_profile_1 = __importDefault(require("../controllers/users/fetch-user-profile"));
const edit_user_nickname_1 = __importDefault(require("../controllers/users/edit-user-nickname"));
const error_1 = require("../models/error");
const router = (0, express_1.Router)();
const errors = new error_1.ValidatorErrors();
// auth check
router.use(check_token_1.default);
// fetch user profile
router.get("/profile", fetch_user_profile_1.default);
// EDIT NICKNAME: PATCH /user/nickname
router.patch("/nickname", (0, express_validator_1.body)("userNickname")
    .isString()
    .withMessage(errors.invalidField())
    .isLength({ max: 24 })
    .withMessage(errors.maxLength("nickname", 24))
    .trim(), edit_user_nickname_1.default);
exports.default = router;
