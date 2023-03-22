"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config/config");
const auth_1 = require("../../models/auth");
const register = async (req, res, next) => {
    try {
        //! TODO: user should not be added to database until they have verified via email
        // Note: After registering, user will be redirected to login page
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = errors.array();
            if (error[0].param === "userEmail") {
                res.status(422);
                return next({
                    message: "Please enter a valid email address and try again.",
                });
            }
            if (error[0].param === "userPassword") {
                res.status(422);
                return next({
                    message: "Please enter a password at least 4 characters long and try again.",
                });
            }
        }
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
        //! TODO: increase # of salt rounds
        const hashedPassword = await bcrypt_1.default.hash(userPassword, 2);
        const newUser = new auth_1.NewUser(userEmail, hashedPassword);
        // TODO: add to real SQL db
        await axios_1.default.post(`${config_1.devDb}/users`, newUser);
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
