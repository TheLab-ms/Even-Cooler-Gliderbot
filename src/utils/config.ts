import configSchema from '../schemas/config';

export function loadConfig() {
  const decodedData = atob(process.env.CONFIG);
  return configSchema.parse(JSON.parse(decodedData || '{}'));
}

const config = loadConfig();

export default config;
