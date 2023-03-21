import { RequestHandler } from "express";
import axios from "axios";

const registerUser: RequestHandler = (req, res, next) => {
  try {
    // TODO: validate form data
    // TODO: hash password
    // TODO: generate userId
    // TODO: put data into db
    // TODO: generate token
    // TODO: return user data and token
    console.log(req.body);
    res.json({ message: "register route pinged" });
  } catch (error) {
    next({ message: "REGISTER USER FALLBACK ERROR" });
  }
};

export default registerUser;
