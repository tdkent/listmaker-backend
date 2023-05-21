import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import checkRequestBody from "../../utils/check-req-body";
import { EditPasswordInt, EditPasswordEnum } from "../../models/user";
import { RequestErrors } from "../../models/error";
import db from "../../db";

const reqError = new RequestErrors();

const editUserPassword: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, EditPasswordEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { newPassword, currentPassword } = <EditPasswordInt>req.body;

    // db queries
    const { rows: check }: { rows: { user_password: string }[] } = await db.query(
      `
    SELECT user_password
    FROM users
    WHERE user_id = $1
    `,
      [userId]
    );

    if (!check.length) {
      res.status(401);
      return next({
        message: reqError.nullResult(),
      });
    }

    const checkPassword = await bcrypt.compare(currentPassword, check[0].user_password);

    if (!checkPassword) {
      res.status(422);
      return next({ message: reqError.incorrectPassword() });
    }

    //! TODO: increase # of salt rounds
    const newHash = await bcrypt.hash(newPassword, 2);

    await db.query(
      `
    UPDATE users
    SET user_password = $1
    WHERE user_id = $2
    `,
      [newHash, userId]
    );

    // response
    res.json({ message: "OK" });
  } catch (error) {
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default editUserPassword;
