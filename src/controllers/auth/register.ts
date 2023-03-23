import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import db from "../../db";
import { UserRegisterInt } from "../../models/auth";

const register: RequestHandler = async (req, res, next) => {
  try {
    //! TODO: user should not be added to database until they have verified via email
    //! Note: After registering, user will be redirected to login page, do not generate token here
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
          message: "Please enter a password at least 4 characters long and try again.",
        });
      }
    }
    //! TODO: increase # of salt rounds
    const newUser = <UserRegisterInt>req.body;
    const hashedPassword = await bcrypt.hash(newUser.userPassword, 2);
    const { rows } = await db.query(
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
