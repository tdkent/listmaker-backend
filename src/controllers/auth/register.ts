import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import axios from "axios";

import { devDb } from "../../config/config";
import { NewUser } from "../../models/auth";

const register: RequestHandler = async (req, res, next) => {
  try {
    //! TODO: user should not be added to database until they have verified via email
    // Note: After registering, user will be redirected to login page
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array();
      if (error[0].param === "userEmail") {
        res.status(422);
        return next({
          message: "Please enter a valid email address and try again.",
        });
      }
      if (error[0].param === "userPassword") {
        res.status(422);
        return next({
          message: "Please enter a password at least 4 characters long and try again.",
        });
      }
    }
    const userEmail = (req.body as { userEmail: string }).userEmail;
    const userPassword = (req.body as { userPassword: string }).userPassword;
    //! TODO: increase # of salt rounds
    const hashedPassword = await bcrypt.hash(userPassword, 2);
    const newUser = new NewUser(userEmail, hashedPassword);
    // TODO: add to real SQL db
    await axios.post(`${devDb}/users`, newUser);
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
