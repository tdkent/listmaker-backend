import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import db from "../../db";
import { UserRegisterReqInt, UserRegisterReqEnum } from "../../models/auth";
import checkRequestBody from "../../utils/check-req-body";
import { RequestErrors } from "../../models/error";

const register: RequestHandler = async (req, res, next) => {
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    const newUser = <UserRegisterReqInt>req.body;
    if (!checkRequestBody(newUser, UserRegisterReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // check userEmail
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    SELECT user_id FROM users
    WHERE user_email = $1
    `,
      [newUser.userEmail]
    );
    if (rows.length) {
      res.status(422);
      return next({
        message: reqError.duplicateEmail(newUser.userEmail),
      });
    }

    // db query
    const hashedPassword = await bcrypt.hash(newUser.userPassword, 10);
    await db.query(
      `
    INSERT INTO users(user_email, user_nickname, user_password)
    VALUES ($1, $2, $3);
    `,
      [newUser.userEmail, newUser.userNickname, hashedPassword]
    );
    res.json({ message: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default register;
