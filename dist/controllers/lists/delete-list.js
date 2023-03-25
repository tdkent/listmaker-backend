"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const deleteList = async (req, res, next) => {
    try {
        const { rows } = await db_1.default.query(`
    DELETE FROM lists
    WHERE id = $1
    AND "userId" = $2
    RETURNING id;
    `, [req.params.listId, req.user.userId]);
        if (!rows.length) {
            res.status(401);
            return next({
                message: `Unable to delete list (id ${req.params.listId}). The list may no longer exist, or you may not be authorized to delete it.`,
            });
        }
        res.json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: `An error occurred attempting to delete list id ${req.params.listId}.`,
        });
    }
};
exports.default = deleteList;
