import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../../db";
import { jwtKey } from "../../config/config";
import { UserLoginInt, UserDataInt, UserData } from "../../models/auth";

const login: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array();
      if (error[0].param === "userEmail") {
        res.status(422);
        return next({
          message: "Please enter a valid email address and try again.",
        });
      }
      //! TODO: Increase pw length minimum
      if (error[0].param === "userPassword") {
        res.status(422);
        return next({
          message: "Your password should be at least 4 characters long!",
        });
      }
    }
    const userLogin = <UserLoginInt>req.body;
    const { rows }: { rows: UserDataInt[] } = await db.query(
      `SELECT id, "userEmail", "userPassword" FROM users WHERE "userEmail" = $1`,
      [userLogin.userEmail]
    );
    console.log("rows: ", rows);
    if (!rows.length) {
      res.status(422);
      return next({
        message: `Could not find an account with email ${userLogin.userEmail}. Please try again, or create a new account.`,
      });
    }
    const comparePw = await bcrypt.compare(
      userLogin.userPassword,
      rows[0].userPassword
    );
    if (!comparePw) {
      res.status(401);
      return next({
        message:
          "The password you submitted does not match our records. Please try again.",
      });
    }
    const token = jwt.sign(
      { userId: rows[0].id, userEmail: userLogin.userEmail },
      jwtKey,
      {
        expiresIn: "30d",
      }
    );
    const userData = new UserData(rows[0].id, userLogin.userEmail, token);
    res.json({ message: "OK", userData });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message:
        "An unexpected server error occurred that prevented login. Please try again later.",
    });
  }
};

export default login;
