import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import { port } from "./config/config";

const app = express();

app.use(json());

app.use("/", (req, res, next) => {
  res.json({ message: "Hello world!" });
});

app.listen(port, () =>
  console.log(`ListMaker express development server is listening on port ${port}.`)
);
