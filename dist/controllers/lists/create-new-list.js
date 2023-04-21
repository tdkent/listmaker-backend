"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const db_1 = __importDefault(require("../../db"));
const list_1 = require("../../models/list");
const error_1 = require("../../models/error");
const check_req_body_1 = __importDefault(require("../../utils/check-req-body"));
const createNewList = async (req, res, next) => {
    const { userId } = req.user;
    const reqError = new error_1.RequestErrors();
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const newList = req.body;
        // check request body
        if (!(0, check_req_body_1.default)(newList, list_1.NewListReqEnum)) {
            res.status(400);
            return next({ message: reqError.badRequest() });
        }
        // same name check
        const { rows: check } = await db_1.default.query(`
    SELECT id FROM lists
    WHERE name = $1
    AND "userId" = $2
    `, [newList.name, userId]);
        if (check.length) {
            res.status(422);
            return next({
                message: reqError.duplicateList(newList.name),
            });
        }
        // db query
        const slug = (0, slugify_1.default)(newList.name.toLowerCase());
        const { rows } = await db_1.default.query(`
    INSERT INTO lists("userId", name, slug, type)
    VALUES ($1, $2, $3, $4)
    RETURNING id, slug;
    `, [userId, newList.name, slug, newList.type]);
        res.json({ list: rows[0] });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: reqError.internalServer(),
        });
    }
};
exports.default = createNewList;
