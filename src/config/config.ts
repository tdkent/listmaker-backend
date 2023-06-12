import dotenv from "dotenv";
dotenv.config();

export const frontendUrl = process.env.FRONTEND_URL as string;
export const devUrl = process.env.DEV_URL as string;
export const devDb = process.env.DEV_DB as string;
export const jwtKey = process.env.JWT_SECRET as string;
export const geoKey = process.env.GEOCODING_API_KEY as string;
