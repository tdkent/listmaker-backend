"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fetch_list_1 = __importDefault(require("../controllers/list/fetch-list"));
const router = (0, express_1.Router)();
// fetch single list
router.get("/:listId", fetch_list_1.default);
exports.default = router;