import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { json } from "body-parser";

import { port } from "./config/config";
import userRoutes from "./routes/user-routes";
import authRoutes from "./routes/auth-routes";
import listRoutes from "./routes/list-routes";
import itemRoutes from "./routes/item-routes";

const app = express();

//cors
app.use(cors());

// body parser
app.use(json());

// auth routes
app.use("/auth", authRoutes);

// user routes
app.use("/user", userRoutes);

// list routes
app.use("/list", listRoutes);

// item routes
app.use("/item", itemRoutes);

// errors
app.use((req, res, next) => {
  res.status(404).json({ message: "That route does not exist!" });
});

app.use(
  (
    error: { message: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status ? res.status : res.status(500);
    res.json({ message: error.message });
  }
);

// initialize server
app.listen(process.env.PORT || port, () =>
  console.log(
    `ListMaker express development server is listening on port ${
      process.env.PORT || port
    }.`
  )
);
