"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fetchUserProfile = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const { data } = await axios_1.default.get(`http://localhost:4000/users/${userId}`);
        res.json(data);
    }
    catch (error) {
        return next({
            message: "A technical error occurred",
            title: `Unable to retrieve userId ${userId}`,
        });
    }
};
exports.default = fetchUserProfile;
