import configSchema from '../schemas/config';
import env from './env';

export function loadConfig() {
  const decodedData = atob(env.CONFIG as string);
  return configSchema.parse(JSON.parse(decodedData || '{}'));
}

const config = loadConfig();

export default config;
