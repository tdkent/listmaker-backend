import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { EditUserProfileInt, EditUserProfileEnum, UserProfileResInt } from "../../models/user";
import { RequestErrors } from "../../models/error";
import checkRequestBody from "../../utils/check-req-body";

const editUserProfile: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    const userData = <EditUserProfileInt>req.body;
    if (!checkRequestBody(userData, EditUserProfileEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // db query
    await db.query(
      `
    UPDATE users
    SET "userNickname" = $1
    WHERE id = $2;
    `,
      [userData.userNickname, userId]
    );
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default editUserProfile;
