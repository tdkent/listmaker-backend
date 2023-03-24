import { RequestHandler } from "express";

import db from "../../db";
import { EditUserProfileInt, UserProfileResInt } from "../../models/user";

const editUserProfile: RequestHandler = async (req, res, next) => {
  try {
    // TODO: request body will eventually contain other editable fields
    const userData = <EditUserProfileInt>req.body;
    const { rows }: { rows: UserProfileResInt[] } = await db.query(
      `
    UPDATE users
    SET "userNickname" = $1
    WHERE id = $2
    RETURNING id, "userEmail", "userNickname";
    `,
      [userData.userNickname, req.user.userId]
    );
    res.json({ message: "OK", user: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: `An error occurred while updating the user's profile data (user id ${req.user.userId}).`,
    });
  }
};

export default editUserProfile;
