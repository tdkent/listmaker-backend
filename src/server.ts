import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import { port } from "./config/config";
import userRoutes from "./routes/user-routes";
import authRoutes from "./routes/auth-routes";

const app = express();

// body parser
app.use(json());

// auth routes
app.use("/auth", authRoutes);

// user routes
app.use("/users", userRoutes);

// list routes

// errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource or route does not exist!" });
});

app.use((error: { message: string }, req: Request, res: Response, next: NextFunction) => {
  res.status ? res.status : res.status(500);
  res.json({ message: error.message });
});

app.listen(process.env.PORT || port, () =>
  console.log(
    `ListMaker express development server is listening on port ${process.env.PORT || port}}.`
  )
);
