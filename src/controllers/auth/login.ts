import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../../db";
import { jwtKey } from "../../config/config";
import { UserLoginInt, UserDataInt, UserData, UserLoginReqEnum } from "../../models/auth";

const login: RequestHandler = async (req, res, next) => {
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    const userLogin = <UserLoginInt>req.body;
    if (Object.keys(userLogin).length !== Object.keys(UserLoginReqEnum).length) {
      res.status(400);
      return next({
        message: "Malformed request body",
      });
    }

    // db query
    const { rows }: { rows: UserDataInt[] } = await db.query(
      `SELECT id, "userEmail", "userPassword" FROM users
      WHERE "userEmail" = $1`,
      [userLogin.userEmail]
    );

    // null result error
    if (!rows.length) {
      res.status(422);
      return next({
        message: `Could not find an account with email ${userLogin.userEmail}. Please try again, or create a new account.`,
      });
    }

    // check password
    const comparePw = await bcrypt.compare(userLogin.userPassword, rows[0].userPassword);
    if (!comparePw) {
      res.status(401);
      return next({
        message: "The password you submitted does not match our records. Please try again.",
      });
    }

    // generate new token
    const token = jwt.sign({ userId: rows[0].id, userEmail: userLogin.userEmail }, jwtKey, {
      expiresIn: "30d",
    });

    // generate response object
    const userData = new UserData(rows[0].id, userLogin.userEmail, token);
    res.json({ message: "OK", userData });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: "There was an unexpected error which prevented login. Please try again later.",
    });
  }
};

export default login;
