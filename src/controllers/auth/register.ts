import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import db from "../../db";
import { UserRegisterReqInt, UserRegisterReqEnum } from "../../models/auth";

const register: RequestHandler = async (req, res, next) => {
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    const newUser = <UserRegisterReqInt>req.body;
    if (Object.keys(newUser).length !== Object.keys(UserRegisterReqEnum).length) {
      res.status(400);
      return next({
        message: "Malformed request body",
      });
    }

    // check userEmail
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    SELECT id FROM users
    WHERE "userEmail" = $1
    `,
      [newUser.userEmail]
    );
    if (rows.length) {
      res.status(422);
      return next({
        message: "An account with that email address already exists!",
      });
    }

    // db query
    //! TODO: increase # of salt rounds
    const hashedPassword = await bcrypt.hash(newUser.userPassword, 2);
    await db.query(
      `
    INSERT INTO users("userEmail", "userNickname", "userPassword")
    VALUES ($1, $2, $3);
    `,
      [newUser.userEmail, newUser.userNickname, hashedPassword]
    );

    res.json({ message: "OK" });
  } catch (error) {
    res.status(500);
    next({
      message:
        "An unexpected server error occurred that prevented your account from being created. Please try again later.",
    });
  }
};

export default register;
