"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const config_1 = require("./config/config");
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use("/users", user_routes_1.default);
// errors
app.use((error, req, res, next) => {
    res.status ? res.status : res.status(500);
    res.json({
        error: "An error occurred.",
        title: error.title,
        message: error.message,
    });
});
app.listen(config_1.port, () => console.log(`ListMaker express development server is listening on port ${config_1.port}.`));
