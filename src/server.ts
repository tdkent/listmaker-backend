import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import { port } from "./config/config";
import userRoutes from "./routes/user-routes";

const app = express();

app.use(json());

app.use("/users", userRoutes);

// errors
app.use(
  (error: { title: string; message: string }, req: Request, res: Response, next: NextFunction) => {
    res.status ? res.status : res.status(500);
    res.json({
      error: "An error occurred.",
      title: error.title,
      message: error.message,
    });
  }
);

app.listen(port, () =>
  console.log(`ListMaker express development server is listening on port ${port}.`)
);
