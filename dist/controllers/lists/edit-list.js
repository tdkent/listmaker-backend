"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../../db"));
const list_1 = require("../../models/list");
const error_1 = require("../../models/error");
const check_req_body_1 = __importDefault(require("../../utils/check-req-body"));
const editList = async (req, res, next) => {
    const { userId } = req.user;
    const { listId } = req.params;
    const reqError = new error_1.RequestErrors();
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // check request body
        if (!(0, check_req_body_1.default)(req.body, list_1.EditListReqEnum)) {
            res.status(400);
            return next({ message: reqError.badRequest() });
        }
        const { listName } = req.body;
        //db query
        const { rows } = await db_1.default.query(`
    UPDATE lists
    SET list_name = $1
    WHERE list_id = $2
    AND user_id = $3
    RETURNING list_id AS "listId";
    `, [listName, Number(listId), userId]);
        // null result error
        if (!rows.length) {
            res.status(401);
            return next({
                message: reqError.nullResult(),
            });
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
exports.default = editList;
