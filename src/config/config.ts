import { config as conf } from "dotenv";
conf();

const _config = {
    databaseUrl: process.env.MONGO_URL,
};

export const config = Object.freeze(_config);