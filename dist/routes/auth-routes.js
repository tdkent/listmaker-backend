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
router.post("/register", (0, express_validator_1.body)("userEmail").isEmail(), (0, express_validator_1.body)("userPassword").isLength({ min: 4 }), register_1.default);
// login user
router.post("/login", (0, express_validator_1.body)("userEmail").isEmail(), (0, express_validator_1.body)("userPassword").isLength({ min: 4 }), login_1.default);
exports.default = router;
