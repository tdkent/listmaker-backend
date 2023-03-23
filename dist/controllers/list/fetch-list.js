"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config/config");
const fetchList = async (req, res, next) => {
    const listId = req.params.listId;
    try {
        const { data } = await axios_1.default.get(`${config_1.devDb}/lists/${listId}`);
        res.json(data);
    }
    catch (error) {
        res.status(500);
        next({
            message: "An error occurred while attempting to fetch list with id",
        });
    }
};
exports.default = fetchList;
