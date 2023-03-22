"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const auth_1 = require("../../models/auth");
const login = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(422);
            return next({ message: "Please enter a valid email address and try again." });
        }
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
        // TODO: update to use real db
        const { data } = await axios_1.default.get(`${config_1.devDb}/users?userEmail=${userEmail}`);
        if (!data.length) {
            res.status(422);
            return next({
                message: `Could not find an account with email ${userEmail}. Please try again, or create a new account.`,
            });
        }
        const comparePw = await bcrypt_1.default.compare(userPassword, data[0].userPassword);
        if (!comparePw) {
            res.status(401);
            return next({
                message: "The password you submitted does not match our records. Please try again.",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: data[0].id, userEmail }, config_1.jwtKey, { expiresIn: "30d" });
        const userData = new auth_1.UserData(data[0].id, userEmail, token);
        res.json({ message: "OK", userData });
    }
    catch (error) {
        res.status(500);
        next({
            message: "An unexpected server error occurred that prevented login. Please try again later.",
        });
    }
};
exports.default = login;
