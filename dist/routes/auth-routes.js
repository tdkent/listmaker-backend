"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const register_1 = __importDefault(require("../controllers/auth/register"));
const login_1 = __importDefault(require("../controllers/auth/login"));
const router = (0, express_1.Router)();
// register user
router.post("/register", (0, express_validator_1.body)("userEmail", "Please enter a valid email address and try again")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(), (0, express_validator_1.body)("userPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches("[A-Z]")
    .withMessage("Password must contain at least 1 uppercase letter")
    .matches("[0-9]")
    .withMessage("Password must contain at least 1 number"), register_1.default);
// login user
router.post("/login", (0, express_validator_1.body)("userEmail", "Please enter a valid email address and try again.")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(), (0, express_validator_1.body)("userPassword", "The password field cannot be blank, please try again.").not().isEmpty(), login_1.default);
exports.default = router;
