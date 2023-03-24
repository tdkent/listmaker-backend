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
const lists_1 = require("../models/lists");
const router = (0, express_1.Router)();
// auth check
router.use(check_token_1.default);
// GET /lists/all
// TODO: add auth check route
// TODO: update route read userId from token instead of params
router.get("/:userId", fetch_all_lists_1.default);
//? TODO: update this post's routing. Should it use params for :listId?
// GET /lists/single
router.get("/:listId", fetch_single_list_1.default);
// POST /lists/new
router.post("/new", (0, express_validator_1.body)("name", "Please enter a list name and try again.").not().isEmpty().trim().escape(), (0, express_validator_1.body)("type", "Please select a valid list type and try again.").isIn(Object.values(lists_1.ListTypesEnum)), create_new_list_1.default);
exports.default = router;
