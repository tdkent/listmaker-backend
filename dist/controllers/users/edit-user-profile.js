"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config/config");
const editUserProfile = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(422);
            return next({
                message: "Please make sure you nickname is at least 1 character long and try again!",
            });
        }
        // TODO: request body will contain other editable fields
        //! TODO: Note that this is currently working correctly and does not represent how the route should actually behave
        const userId = req.params.userId;
        const userNickname = req.body.userNickname;
        const response = await axios_1.default.put(`${config_1.devDb}/users/${userId}`, userNickname);
        console.log("response: ", response.data);
        res.json({ message: "OK" });
    }
    catch (error) {
        res.status(500);
        next({
            message: "An unexpected error occurred when we attempted to update your profile. Please try again later.",
        });
    }
};
exports.default = editUserProfile;
