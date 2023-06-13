import dotenv from "dotenv";
dotenv.config();

export const devDb = process.env.DEV_DB as string;
export const jwtKey = process.env.JWT_SECRET as string;
export const geoKey = process.env.GEOCODING_API_KEY as string;
