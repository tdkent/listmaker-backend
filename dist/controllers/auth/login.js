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
const check_req_body_1 = __importDefault(require("../../utils/check-req-body"));
const error_1 = require("../../models/error");
const login = async (req, res, next) => {
    const reqError = new error_1.RequestErrors();
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // check request body
        const userLogin = req.body;
        if (!(0, check_req_body_1.default)(userLogin, auth_1.UserLoginReqEnum)) {
            res.status(400);
            return next({ message: reqError.badRequest() });
        }
        // db query
        const { rows } = await db_1.default.query(`SELECT
        user_id AS "userId",
        user_email AS "userEmail",
        user_nickname AS "userNickname",
        user_password AS "userPassword"
      FROM users
      WHERE user_email = $1`, [userLogin.userEmail]);
        // null result error
        if (!rows.length) {
            res.status(422);
            return next({
                message: reqError.incorrectEmail(userLogin.userEmail),
            });
        }
        // check password
        const comparePw = await bcrypt_1.default.compare(userLogin.userPassword, rows[0].userPassword);
        if (!comparePw) {
            res.status(401);
            return next({
                message: reqError.incorrectPassword(),
            });
        }
        const { userId, userEmail, userNickname } = rows[0];
        // token
        const token = jsonwebtoken_1.default.sign({ userId, userEmail }, config_1.jwtKey, {
            expiresIn: "30d",
        });
        // response
        res.json({ userId, userEmail, userNickname, token });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: reqError.internalServer(),
        });
    }
};
exports.default = login;
