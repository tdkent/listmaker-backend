"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../../db"));
const user_1 = require("../../models/user");
const error_1 = require("../../models/error");
const check_req_body_1 = __importDefault(require("../../utils/check-req-body"));
const editUserProfile = async (req, res, next) => {
    const { userId } = req.user;
    const reqError = new error_1.RequestErrors();
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // check request body
        if (!(0, check_req_body_1.default)(req.body, user_1.EditUserProfileEnum)) {
            res.status(400);
            return next({ message: reqError.badRequest() });
        }
        const { userNickname } = req.body;
        // db query
        await db_1.default.query(`
    UPDATE users
    SET user_nickname = $1
    WHERE user_id = $2;
    `, [userNickname, userId]);
        res.json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: reqError.internalServer(),
        });
    }
};
exports.default = editUserProfile;
