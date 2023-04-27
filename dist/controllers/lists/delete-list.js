"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../../db"));
const error_1 = require("../../models/error");
const list_1 = require("../../models/list");
const deleteList = async (req, res, next) => {
    const { userId } = req.user;
    const { listId } = req.params;
    const reqError = new error_1.RequestErrors();
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }
        // detemine list type
        const { rows } = await db_1.default.query(`
    SELECT list_type AS "listType" FROM lists
    WHERE list_id = $1 
    AND user_id = $2 
    `, [listId, userId]);
        // null result error
        if (!rows.length) {
            res.status(401);
            return next({
                message: reqError.nullResult(),
            });
        }
        // filter by list type
        //? put each filter type into a separate file?
        if (rows[0].listType === list_1.AllListTypesEnum.shop) {
            // delete items
            await db_1.default.query(`
      DELETE FROM items_shopping
      WHERE list_id = $1;
      `, [listId]);
            // delete list
            await db_1.default.query(`
      DELETE FROM lists
      WHERE list_id = $1;
      `, [listId]);
        }
        res.json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: reqError.internalServer(),
        });
    }
};
exports.default = deleteList;
