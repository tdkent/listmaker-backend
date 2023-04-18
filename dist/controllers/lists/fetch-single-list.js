"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../../db"));
const list_1 = require("../../models/list");
const error_1 = require("../../models/error");
const fetchList = async (req, res, next) => {
    const { userId } = req.user;
    const { listId } = req.params;
    const reqError = new error_1.RequestErrors();
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // db query
        const { rows } = await db_1.default.query(`
    SELECT * FROM lists
    WHERE id = $1
    AND "userId" = $2;
    `, [Number(listId), userId]);
        // null result error
        if (!rows.length) {
            res.status(401);
            return next({
                message: reqError.nullResult(),
            });
        }
        // add items based on list type
        // TODO: type of items variable based on type of item
        let items = [];
        if (rows[0].type === list_1.AllListTypesEnum.shop) {
            const { rows } = await db_1.default.query(`
      SELECT * FROM items_shopping
      WHERE "listId" = $1 AND "isActive" = true;
      `, [listId]);
            items = rows;
        }
        res.json({ ...rows[0], items });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: reqError.internalServer(),
        });
    }
};
exports.default = fetchList;
