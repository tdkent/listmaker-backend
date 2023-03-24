"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const db_1 = __importDefault(require("../../db"));
const createNewList = async (req, res, next) => {
    try {
        // TODO: prevent user from creating two lists with the same name
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = errors.array();
            if (error[0].param === "name") {
                res.status(422);
                return next({
                    message: "Please enter a list name and try again.",
                });
            }
            if (error[0].param === "type") {
                res.status(422);
                return next({
                    message: "Please select one of the provided list types and try again.",
                });
            }
        }
        const newList = req.body;
        const slug = (0, slugify_1.default)(newList.name.toLowerCase());
        const { rows } = await db_1.default.query(`
    INSERT INTO lists("userId", name, slug, type)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [req.user.userId, newList.name, slug, newList.type]);
        console.log("Rows", rows);
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
