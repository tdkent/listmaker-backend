import { RequestHandler } from "express";

import db from "../../db";
import { EditUserProfileInt, UserProfileInt, UserProfileDbInt } from "../../models/user";

const editUserProfile: RequestHandler = async (req, res, next) => {
  try {
    // TODO: request body will eventually contain other editable fields
    const userData = <EditUserProfileInt>req.body;
    const { rows }: { rows: UserProfileDbInt[] } = await db.query(
      `
    UPDATE users
    SET "userNickname" = $1
    WHERE id = $2
    RETURNING "userEmail", "userNickname";
    `,
      [userData.userNickname, req.user.userId]
    );
    const user: UserProfileInt = {
      userId: req.user.userId,
      ...rows[0],
    };
    res.json({ message: "OK", user });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: `An error occurred while updating the user's profile data (user id ${req.user.userId}).`,
    });
  }
};

export default editUserProfile;
