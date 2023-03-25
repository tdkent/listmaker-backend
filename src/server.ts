import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import { port } from "./config/config";
import userRoutes from "./routes/user-routes";
import authRoutes from "./routes/auth-routes";
import listsRoutes from "./routes/list-routes";

const app = express();

// TODO: Add cors middleware
// body parser
app.use(json());

// auth routes
app.use("/auth", authRoutes);

// user routes
app.use("/user", userRoutes);

// lists routes
app.use("/lists", listsRoutes);

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
