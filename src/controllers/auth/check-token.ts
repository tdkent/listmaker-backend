import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import { jwtKey } from "../../config/config";

interface UserDataJwtPayload extends JwtPayload {
  userId: number;
}

// module augmentation extends Request to include a user object
declare module "express-serve-static-core" {
  interface Request {
    user: {
      userId: number;
    };
  }
}

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  // CORS check
  //? TODO: Upgrade this method?
  if (req.method === "OPTIONS") return next();
  try {
    if (!req.headers.authorization || req.headers.authorization.split(" ")[0] !== "Bearer") {
      res.status(401);
      return next({
        message: "Authentication failed! Please make sure you are logged in and try again.",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401);
      return next({
        message: "Malformed authentication string.",
      });
    }
    // Note: jwt will throw its own error to the catch block if verification is unsuccessful

    // jwt.verify is a function supplied by the jsonwebtoken package
    const verify = jwt.verify(token, jwtKey) as UserDataJwtPayload;

    // if token verification is successful we extract the userId
    // and attempt to add to custom object req.user
    req.user = { userId: verify.userId };

    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    next({
      message: "Authentication failed!",
    });
  }
};

export default checkToken;
