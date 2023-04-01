import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../../db";
import { jwtKey } from "../../config/config";
import { UserLoginInt, UserDataInt, UserData, UserLoginReqEnum } from "../../models/auth";
import checkRequestBody from "../../utils/check-req-body";
import { RequestErrors } from "../../models/error";

const login: RequestHandler = async (req, res, next) => {
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    const userLogin = <UserLoginInt>req.body;
    if (!checkRequestBody(userLogin, UserLoginReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
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
        message: reqError.incorrectEmail(userLogin.userEmail),
      });
    }

    // check password
    const comparePw = await bcrypt.compare(userLogin.userPassword, rows[0].userPassword);
    if (!comparePw) {
      res.status(401);
      return next({
        message: reqError.incorrectPassword(),
      });
    }

    // generate new token
    //? TODO: how to make use of the token expiration
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
      message: reqError.internalServer(),
    });
  }
};

export default login;
