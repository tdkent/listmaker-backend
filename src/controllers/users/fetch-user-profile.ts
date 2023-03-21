import { RequestHandler } from "express";
import axios from "axios";

const fetchUserProfile: RequestHandler<{ userId: string }> = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    // TODO: this will query the database using a Pool query rather than using axios fetch
    // TODO: Add response object type
    const { data } = await axios.get(`http://localhost:4000/users/${userId}`);
    console.log("data: ", data.id);
    // sample error handling if there is an issue with the retrieved data
    if (data.id == 1) {
      res.status(500);
      return next({ message: "ERROR WITH DATA" });
    }
    res.json(data);
  } catch (error) {
    // Note: If an error object is not specified, the error status set below will be ignored
    // The generic 404 error handler will be invoked instead
    res.status(500);
    return next({ message: "FETCH USER PROFILE FALLBACK ERROR" });
  }
};

export default fetchUserProfile;
