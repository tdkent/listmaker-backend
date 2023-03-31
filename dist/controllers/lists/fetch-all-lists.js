"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const error_1 = require("../../models/error");
const fetchAllLists = async (req, res, next) => {
    const { userId } = req.user;
    try {
        // db query
        const { rows } = await db_1.default.query(`
    SELECT * FROM lists
    WHERE "userId" = $1
    `, [userId]);
        res.json({ message: "OK", lists: rows });
    }
    catch (error) {
        res.status(500);
        next({ message: error_1.ErrorMsgEnum.internalServer });
    }
};
exports.default = fetchAllLists;
