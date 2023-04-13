"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const check_token_1 = __importDefault(require("../controllers/auth/check-token"));
const fetch_all_lists_1 = __importDefault(require("../controllers/lists/fetch-all-lists"));
const fetch_single_list_1 = __importDefault(require("../controllers/lists/fetch-single-list"));
const create_new_list_1 = __importDefault(require("../controllers/lists/create-new-list"));
const edit_list_1 = __importDefault(require("../controllers/lists/edit-list"));
const delete_list_1 = __importDefault(require("../controllers/lists/delete-list"));
const list_1 = require("../models/list");
const error_1 = require("../models/error");
const router = (0, express_1.Router)();
const errors = new error_1.ValidatorErrors();
// auth check
router.use(check_token_1.default);
// GET /list/fetch
router.get("/fetch", fetch_all_lists_1.default);
// GET /list/fetch/:listId
router.get("/fetch/:listId", (0, express_validator_1.param)("listId", errors.badRequest()).isNumeric(), fetch_single_list_1.default);
// POST /list/new
router.post("/new", (0, express_validator_1.body)("name")
    .isString()
    .withMessage(errors.invalidField())
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .isLength({ max: 24 })
    .withMessage(errors.maxLength("name", 24))
    .trim(), 
// TODO: how to filter user input?
// .escape(),
(0, express_validator_1.body)("type", errors.invalidField()).isIn(Object.values(list_1.AllListTypesEnum)), create_new_list_1.default);
// PATCH /list/edit/:listId
router.patch("/edit/:listId", (0, express_validator_1.param)("listId", errors.badRequest()).isNumeric(), 
// NOTE: request body will eventually have additional fields
(0, express_validator_1.body)("name")
    .isString()
    .withMessage(errors.invalidField())
    .isLength({ max: 24 })
    .withMessage(errors.maxLength("name", 24))
    .not()
    .isEmpty()
    .withMessage(errors.nullField("name"))
    .trim()
    .escape(), edit_list_1.default);
// DELETE /list/delete/:listId
router.delete("/delete/:listId", (0, express_validator_1.param)("listId", errors.badRequest()).isNumeric(), delete_list_1.default);
exports.default = router;
