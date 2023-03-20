"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const config_1 = require("./config/config");
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use("/", (req, res, next) => {
    res.json({ message: "Hello world!" });
});
app.listen(config_1.port, () => console.log(`ListMaker express development server is listening on port ${config_1.port}.`));
