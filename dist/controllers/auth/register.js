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
        console.log(userEmail, userPassword, hashedPassword);
        // const newUser = new NewUser(userEmail, hashedPassword);
        // TODO: add to real SQL db
        // await axios.post(`${devDb}/users`, newUser);
        const { rows } = await db_1.default.query(`
    INSERT INTO users("userEmail", "userPassword")
    VALUES ($1, $2)
    RETURNING *;
    `, [userEmail, hashedPassword]);
        console.log("register result", rows);
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
