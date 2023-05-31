import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { json } from "body-parser";

import { port, frontendUrl, backendUrl } from "./config/config";
import userRoutes from "./routes/user-routes";
import authRoutes from "./routes/auth-routes";
import listRoutes from "./routes/list-routes";
import shoppingRoutes from "./routes/shopping-routes";
import todoRoutes from "./routes/todo-routes";

const app = express();

// body parser
app.use(json());

//cors
// app.use(
//   cors({
//     origin: frontendUrl,
//   })
// );

app.use(cors(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// auth routes
app.use("/auth", authRoutes);

// user routes
app.use("/user", userRoutes);

// list routes
app.use("/list", listRoutes);

// shopping routes
app.use("/shopping", shoppingRoutes);

// to-do routes
app.use("/todo", todoRoutes);

// errors
app.use((req, res, next) => {
  res.status(404).json({ message: "That route does not exist!" });
});

app.use((error: { message: string }, req: Request, res: Response, next: NextFunction) => {
  res.status ? res.status : res.status(500);
  res.json({ message: error.message });
});

// initialize server
app.listen(process.env.PORT || port, () =>
  console.log(
    `ListMaker express development server is listening on port ${process.env.PORT || port}.`
  )
);
