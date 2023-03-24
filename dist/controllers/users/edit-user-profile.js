"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const editUserProfile = async (req, res, next) => {
    try {
        // TODO: request body will eventually contain other editable fields
        const userData = req.body;
        const { rows } = await db_1.default.query(`
    UPDATE users
    SET "userNickname" = $1
    WHERE id = $2
    RETURNING id, "userEmail", "userNickname";
    `, [userData.userNickname, req.user.userId]);
        res.json({ message: "OK", user: rows[0] });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: `An error occurred while updating the user's profile data (user id ${req.user.userId}).`,
        });
    }
};
exports.default = editUserProfile;
