import fs from 'fs';
import path from 'path';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve('.env'),
});

// Check for dotenv file at root
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('No .env file found at project root.');
  process.exit(1);
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;
  @IsString()
  ACCESS_TOKEN_SECRET: string;
  @IsString()
  ACCESS_TOKEN_EXPIRE_IN: string;
  @IsString()
  REFRESH_TOKEN_SECRET: string;
  @IsString()
  REFRESH_TOKEN_EXPIRE_IN: string;
}

const configServer = plainToInstance(ConfigSchema, process.env);
const e = validateSync(configServer);

if (e.length > 0) {
  console.error('Config validation error:');
  const errors = e.map((eItem) => {
    return {
      property: eItem.property,
      constraints: eItem.constraints,
      value: eItem.value,
    };
  });
  throw errors;
}

const envConfig = configServer;
export default envConfig;
