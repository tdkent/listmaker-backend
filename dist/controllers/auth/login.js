"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../../db"));
const config_1 = require("../../config/config");
const auth_1 = require("../../models/auth");
const login = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const userLogin = req.body;
        const { rows } = await db_1.default.query(`SELECT id, "userEmail", "userPassword" FROM users WHERE "userEmail" = $1`, [userLogin.userEmail]);
        if (!rows.length) {
            res.status(422);
            return next({
                message: `Could not find an account with email ${userLogin.userEmail}. Please try again, or create a new account.`,
            });
        }
        const comparePw = await bcrypt_1.default.compare(userLogin.userPassword, rows[0].userPassword);
        if (!comparePw) {
            res.status(401);
            return next({
                message: "The password you submitted does not match our records. Please try again.",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: rows[0].id, userEmail: userLogin.userEmail }, config_1.jwtKey, {
            expiresIn: "30d",
        });
        const userData = new auth_1.UserData(rows[0].id, userLogin.userEmail, token);
        res.json({ message: "OK", userData });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: "An unexpected server error occurred that prevented login. Please try again later.",
        });
    }
};
exports.default = login;
