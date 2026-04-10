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
  // Information
  APP_NAME: z.string(),

  // Secrets
  DATABASE_URL: z.string(),
  SECRET_API_KEY: z.string(),

  // Services
  RESEND_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_CLIENT_REDIRECT_URI: z.string(),

  // Application
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRE_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRE_IN: z.string(),
  OTP_EXPIRE_IN: z.string(),

  // Seed data: admin user
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
  ADMIN_NAME: z.string().min(1),
  ADMIN_PHONE_NUMBER: z.string().min(10).max(15),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.error(
    'Invalid environment variables:',
    z.prettifyError(configServer.error),
  );
  process.exit(1);
}

const envConfig = configServer.data;
export default envConfig;
