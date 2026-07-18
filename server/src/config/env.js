// Loading environment variables

import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT;
export const dbUri = process.env.MONGODB_URI;
export const adminKey = process.env.ADMIN_KEY;
