import fs from 'fs';
import path from 'path';
import * as z from 'zod';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve('.env'),
});

// Check for dotenv file at root
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('No .env file found at project root.');
  process.exit(1);
}

const configSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRE_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRE_IN: z.string(),
  SECRET_API_KEY: z.string(),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.error('Invalid environment variables:', configServer.error.format());
  process.exit(1);
}

const envConfig = configServer.data;
export default envConfig;
