import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT as string;
export const devDb = process.env.DEV_DB as string;
export const jwtKey = process.env.JWT_SECRET as string;
