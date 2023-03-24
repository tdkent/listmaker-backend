import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import db from "../../db";
import { UserRegisterInt } from "../../models/auth";

const register: RequestHandler = async (req, res, next) => {
  try {
    //! TODO: user should not be added to database until they have verified via email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //! TODO: increase # of salt rounds
    const newUser = <UserRegisterInt>req.body;
    const hashedPassword = await bcrypt.hash(newUser.userPassword, 2);
    await db.query(
      `
    INSERT INTO users("userEmail", "userNickname", "userPassword")
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [newUser.userEmail, newUser.userNickname, hashedPassword]
    );
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message:
        "An unexpected server error occurred that prevented your account from being created. Please try again later.",
    });
  }
};

export default register;
