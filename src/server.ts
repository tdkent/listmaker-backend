import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { json } from "body-parser";

import userRoutes from "./routes/user-routes";
import authRoutes from "./routes/auth-routes";
import listRoutes from "./routes/list-routes";
import shoppingRoutes from "./routes/shopping-routes";
import todoRoutes from "./routes/todo-routes";

const app = express();

// body parser
app.use(json());

// cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL as string,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

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
app.listen(process.env.PORT, () =>
  console.log(`ListMaker express development server is listening on port ${process.env.PORT}.`)
);
