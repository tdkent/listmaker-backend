"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const error_1 = require("../../models/error");
const fetchAllLists = async (req, res, next) => {
    const { userId } = req.user;
    const reqError = new error_1.RequestErrors();
    try {
        // db query
        const { rows } = await db_1.default.query(`
    SELECT 
      list_id AS "listId",
      user_id AS "userId",
      list_name AS "listName",
      list_slug AS "listSlug",
      list_type AS "listType"   
    FROM lists
    WHERE user_id = $1
    `, [userId]);
        res.json(rows);
    }
    catch (error) {
        res.status(500);
        next({ message: reqError.internalServer() });
    }
};
exports.default = fetchAllLists;
