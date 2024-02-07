import dotenv from 'dotenv';

import configSchema from '../schemas/config';

dotenv.config();

export function loadConfig() {
  const decodedData = atob(process.env.CONFIG as string);
  return configSchema.parse(JSON.parse(decodedData || '{}'));
}

const config = loadConfig();

export default config;
