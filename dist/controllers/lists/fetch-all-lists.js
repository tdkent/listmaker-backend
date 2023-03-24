"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const fetchAllLists = async (req, res, next) => {
    try {
        const { rows } = await db_1.default.query(`
    SELECT * FROM lists
    WHERE "userId" = $1
    `, [req.user.userId]);
        res.json({ message: "OK", lists: rows });
    }
    catch (error) {
        res.status(500);
        next({ message: "An error occurred while fetching lists." });
    }
};
exports.default = fetchAllLists;
