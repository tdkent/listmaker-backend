"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const register_1 = __importDefault(require("../controllers/auth/register"));
const login_1 = __importDefault(require("../controllers/auth/login"));
const error_1 = require("../models/error");
const router = (0, express_1.Router)();
const error = new error_1.ValidatorErrors();
// register user
router.post("/register", (0, express_validator_1.body)("userEmail", error.invalidField()).isEmail().trim().escape().normalizeEmail(), (0, express_validator_1.body)("userNickname")
    .isString()
    .withMessage(error.invalidField())
    .isLength({ max: 24 })
    .withMessage(error.maxLength("nickname", 24))
    .trim()
    .escape(), (0, express_validator_1.body)("userPassword", "Password does not meet requirements")
    .isString()
    .withMessage(error.invalidField())
    .isLength({ min: 8 })
    .matches("[a-z]")
    .withMessage("Password requires at least 1 lower case letter")
    .matches("[A-Z]")
    .withMessage("Password requires at least 1 upper case letter")
    .matches("[0-9]")
    .withMessage("Password requires at least 1 number")
    .matches("[*@#^&$!%]")
    .withMessage("Password requires at least 1 symbol: *@#^&$!%"), register_1.default);
// login user
router.post("/login", (0, express_validator_1.body)("userEmail", error.invalidField()).isEmail().trim().escape().normalizeEmail(), (0, express_validator_1.body)("userPassword", error.invalidField()).isString(), login_1.default);
exports.default = router;
