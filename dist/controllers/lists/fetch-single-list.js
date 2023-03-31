"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../../db"));
const error_1 = require("../../models/error");
const fetchList = async (req, res, next) => {
    const { userId } = req.user;
    const { listId } = req.params;
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400);
            return next({ message: error_1.ErrorMsgEnum.badRequest });
        }
        // db query
        const { rows } = await db_1.default.query(`
    SELECT * FROM lists
    WHERE id = $1
    AND "userId" = $2;
    `, [listId, userId]);
        // null result error
        if (!rows.length) {
            res.status(403);
            return next({
                message: error_1.ErrorMsgEnum.nullResult,
            });
        }
        res.json({ message: "OK", list: rows[0] });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: error_1.ErrorMsgEnum.internalServer,
        });
    }
};
exports.default = fetchList;
