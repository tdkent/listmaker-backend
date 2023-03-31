"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const db_1 = __importDefault(require("../../db"));
const createNewList = async (req, res, next) => {
    const { userId } = req.user;
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // db query
        const newList = req.body;
        const { rows: check } = await db_1.default.query(`
    SELECT id FROM lists
    WHERE name = $1
    AND "userId" = $2
    `, [newList.name, req.user.userId]);
        if (check.length) {
            res.status(422);
            return next({
                message: `You already have a list named ${newList.name}. Please enter a new name and try again.`,
            });
        }
        const slug = (0, slugify_1.default)(newList.name.toLowerCase());
        const { rows } = await db_1.default.query(`
    INSERT INTO lists("userId", name, slug, type)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [req.user.userId, newList.name, slug, newList.type]);
        res.json({ message: "OK", list: rows[0] });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: "An error occurred while creating the new list. Please try again later.",
        });
    }
};
exports.default = createNewList;
