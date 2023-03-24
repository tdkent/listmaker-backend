"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../../db"));
const register = async (req, res, next) => {
    try {
        //! TODO: user should not be added to database until they have verified via email
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        //! TODO: increase # of salt rounds
        const newUser = req.body;
        const hashedPassword = await bcrypt_1.default.hash(newUser.userPassword, 2);
        await db_1.default.query(`
    INSERT INTO users("userEmail", "userNickname", "userPassword")
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [newUser.userEmail, newUser.userNickname, hashedPassword]);
        res.json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: "An unexpected server error occurred that prevented your account from being created. Please try again later.",
        });
    }
};
exports.default = register;
