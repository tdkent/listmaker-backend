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
  if (req.method === "OPTIONS") return next();
  try {
    if (
      !req.headers.authorization ||
      req.headers.authorization.split(" ")[0] !== "Bearer"
    ) {
      res.status(401);
      return next({
        message:
          "Authentication failed! Please make sure you are logged in and try again.",
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
    const verify = jwt.verify(token, jwtKey) as UserDataJwtPayload;
    req.user = { userId: verify.userId };
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    next({
      message: "Authentication failed!",
    });
  }
};

export default checkToken;
