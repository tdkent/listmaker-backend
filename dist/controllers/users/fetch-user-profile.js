"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const error_1 = require("../../models/error");
const fetchUserProfile = async (req, res, next) => {
    const { userId } = req.user;
    const reqError = new error_1.RequestErrors();
    try {
        // db query
        const { rows } = await db_1.default.query(`
    SELECT
      user_id AS "userId",
      user_email AS "userEmail",
      user_nickname AS "userNickname"
    FROM users WHERE user_id = $1;
    `, [userId]);
        res.json({ user: rows[0] });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        return next({
            message: reqError.internalServer(),
        });
    }
};
exports.default = fetchUserProfile;
