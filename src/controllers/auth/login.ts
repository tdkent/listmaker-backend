import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { devDb, jwtKey } from "../../config/config";
import { UserLoginInt, UserData } from "../../models/auth";

const login: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
      return next({ message: "Please enter a valid email address and try again." });
    }
    const userEmail = (req.body as { userEmail: string }).userEmail;
    const userPassword = (req.body as { userPassword: string }).userPassword;
    // TODO: update to use real db
    const { data }: { data: UserLoginInt[] } = await axios.get(
      `${devDb}/users?userEmail=${userEmail}`
    );
    if (!data.length) {
      res.status(422);
      return next({
        message: `Could not find an account with email ${userEmail}. Please try again, or create a new account.`,
      });
    }
    const comparePw = await bcrypt.compare(userPassword, data[0].userPassword);
    if (!comparePw) {
      res.status(401);
      return next({
        message: "The password you submitted does not match our records. Please try again.",
      });
    }
    const token = jwt.sign({ userId: data[0].id, userEmail }, jwtKey, { expiresIn: "30d" });
    const userData = new UserData(data[0].id, userEmail, token);
    res.json({ message: "OK", userData });
  } catch (error) {
    res.status(500);
    next({
      message: "An unexpected server error occurred that prevented login. Please try again later.",
    });
  }
};

export default login;
