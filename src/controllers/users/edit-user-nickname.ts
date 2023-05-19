import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { EditNicknameInt, EditNicknameEnum, UserProfileResInt } from "../../models/user";
import { RequestErrors } from "../../models/error";
import checkRequestBody from "../../utils/check-req-body";

const editUserNickname: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, EditNicknameEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { userNickname } = <EditNicknameInt>req.body;

    // db query
    await db.query(
      `
    UPDATE users
    SET user_nickname = $1
    WHERE user_id = $2;
    `,
      [userNickname, userId]
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

export default editUserNickname;
