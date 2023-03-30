"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../../db"));
const editList = async (req, res, next) => {
    try {
        //! Note: Currently the list name is the only editable field. May add others later.
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const updateList = req.body;
        const { rows } = await db_1.default.query(`
    UPDATE lists
    SET name = $1
    WHERE id = $2
    AND "userId" = $3
    RETURNING id;
    `, [updateList.name, req.params.listId, req.user.userId]);
        if (!rows.length) {
            res.status(401);
            return next({
                message: `Unable to access list (id ${req.params.listId}). The list may not exist, or you may not be authorized.`,
            });
        }
        res.json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: `An error occurred while editing list id `,
        });
    }
};
exports.default = editList;
