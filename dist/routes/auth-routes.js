"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const register_user_1 = __importDefault(require("../controllers/auth/register-user"));
const router = (0, express_1.Router)();
// register user
router.post("/register", (0, express_validator_1.body)("userEmail").isEmail(), (0, express_validator_1.body)("userPassword").isLength({ min: 4 }), register_user_1.default);
// login user
exports.default = router;