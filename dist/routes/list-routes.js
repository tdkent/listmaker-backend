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
// auth check
router.use(check_token_1.default);
// GET /lists/fetch
router.get("/fetch", fetch_all_lists_1.default);
// GET /lists/fetch/:listId
router.get("/fetch/:listId", (0, express_validator_1.param)("listId", error_1.ValidatorMsgEnum.badRequest).isNumeric(), fetch_single_list_1.default);
// POST /lists/new
router.post("/new", (0, express_validator_1.body)("name", "Please enter a list name and try again.").not().isEmpty().trim().escape(), (0, express_validator_1.body)("type", "Please select a valid list type and try again.").isIn(Object.values(list_1.ListTypesEnum)), create_new_list_1.default);
// PATCH /lists/edit/:listId
router.patch("/edit/:listId", (0, express_validator_1.body)("name", "Please enter a list name and try again.").not().isEmpty().trim().escape(), edit_list_1.default);
// DELETE /lists/delete/:listId
router.delete("/delete/:listId", delete_list_1.default);
exports.default = router;
