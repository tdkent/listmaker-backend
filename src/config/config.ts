import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT as string;
// module.exports = {
//   port: process.env.PORT as string,
// };
