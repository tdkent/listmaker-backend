"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const fetchUserProfile = async (req, res, next) => {
    try {
        const { rows } = await db_1.default.query(`
    SELECT id, "userEmail", "userNickname"
    FROM users
    WHERE id = $1
    `, [req.user.userId]);
        res.json({ message: "OK", user: rows[0] });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        return next({
            message: `An error occurred while fetching the user's profile data (user id ${req.user.userId}).`,
        });
    }
};
exports.default = fetchUserProfile;
