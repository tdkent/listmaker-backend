"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../../db"));
const auth_1 = require("../../models/auth");
const register = async (req, res, next) => {
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // check request body
        const newUser = req.body;
        if (Object.keys(newUser).length !== Object.keys(auth_1.UserRegisterReqEnum).length) {
            res.status(400);
            return next({
                message: "Malformed request body",
            });
        }
        // check userEmail
        const { rows } = await db_1.default.query(`
    SELECT id FROM users
    WHERE "userEmail" = $1
    `, [newUser.userEmail]);
        if (rows.length) {
            res.status(422);
            return next({
                message: "An account with that email address already exists!",
            });
        }
        // db query
        //! TODO: increase # of salt rounds
        const hashedPassword = await bcrypt_1.default.hash(newUser.userPassword, 2);
        await db_1.default.query(`
    INSERT INTO users("userEmail", "userNickname", "userPassword")
    VALUES ($1, $2, $3);
    `, [newUser.userEmail, newUser.userNickname, hashedPassword]);
        res.json({ message: "OK" });
    }
    catch (error) {
        res.status(500);
        next({
            message: "An unexpected server error occurred that prevented your account from being created. Please try again later.",
        });
    }
};
exports.default = register;
