import { RequestHandler } from "express";
import axios from "axios";

const fetchUserProfile: RequestHandler<{ userId: string }> = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const { data } = await axios.get(`http://localhost:4000/users/${userId}`);
    res.json(data);
  } catch (error) {
    return next({
      message: "A technical error occurred",
      title: `Unable to retrieve userId ${userId}`,
    });
  }
};

export default fetchUserProfile;
