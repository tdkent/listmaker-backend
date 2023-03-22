import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import axios from "axios";

import { devDb } from "../../config/config";

const editUserProfile: RequestHandler<{ userId: number }> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
      return next({
        message: "Please make sure you nickname is at least 1 character long and try again!",
      });
    }
    // TODO: request body will contain other editable fields
    //! TODO: Note that this is currently working correctly and does not represent how the route should actually behave
    const userId = req.params.userId;
    const userNickname = (req.body as { userNickname: string }).userNickname;
    const response = await axios.put(`${devDb}/users/${userId}`, userNickname);
    console.log("response: ", response.data);
    res.json({ message: "OK" });
  } catch (error) {
    res.status(500);
    next({
      message:
        "An unexpected error occurred when we attempted to update your profile. Please try again later.",
    });
  }
};

export default editUserProfile;
