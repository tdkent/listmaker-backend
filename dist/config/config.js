"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoKey = exports.jwtKey = exports.devDb = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.devDb = process.env.DEV_DB;
exports.jwtKey = process.env.JWT_SECRET;
exports.geoKey = process.env.GEOCODING_API_KEY;
