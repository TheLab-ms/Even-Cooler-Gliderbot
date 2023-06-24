import dotenv from 'dotenv';
dotenv.config();

import configSchema from '../schemas/config';

export function loadConfig() {
  return configSchema.parse(JSON.parse(process.env.CONFIG || '{}'));
}

const config = loadConfig();

export default config;
