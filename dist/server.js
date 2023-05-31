"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const config_1 = require("./config/config");
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const list_routes_1 = __importDefault(require("./routes/list-routes"));
const shopping_routes_1 = __importDefault(require("./routes/shopping-routes"));
const todo_routes_1 = __importDefault(require("./routes/todo-routes"));
const app = (0, express_1.default)();
// body parser
app.use((0, body_parser_1.json)());
//cors
// app.use(
//   cors({
//     origin: frontendUrl,
//   })
// );
app.use((0, cors_1.default)(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://deft-torte-c93e9a.netlify.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});
// auth routes
app.use("/auth", auth_routes_1.default);
// user routes
app.use("/user", user_routes_1.default);
// list routes
app.use("/list", list_routes_1.default);
// shopping routes
app.use("/shopping", shopping_routes_1.default);
// to-do routes
app.use("/todo", todo_routes_1.default);
// errors
app.use((req, res, next) => {
    res.status(404).json({ message: "That route does not exist!" });
});
app.use((error, req, res, next) => {
    res.status ? res.status : res.status(500);
    res.json({ message: error.message });
});
// initialize server
app.listen(process.env.PORT || config_1.port, () => console.log(`ListMaker express development server is listening on port ${process.env.PORT || config_1.port}.`));
