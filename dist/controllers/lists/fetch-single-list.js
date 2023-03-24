"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const fetchList = async (req, res, next) => {
    try {
        const { rows } = await db_1.default.query(`
    SELECT * FROM lists
    WHERE id = $1
    AND "userId" = $2;
    `, [req.params.listId, req.user.userId]);
        if (!rows.length) {
            res.status(401);
            return next({
                message: `Unable to retrieve list (id ${req.params.listId}). The list may no longer exist, or you may no longer be authorized to view it.`,
            });
        }
        res.json({ message: "OK", list: rows[0] });
    }
    catch (error) {
        res.status(500);
        next({
            message: "An error occurred while attempting to fetch list with id",
        });
    }
};
exports.default = fetchList;
