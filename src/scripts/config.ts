import { existsSync } from 'node:fs';
import { config } from 'dotenv';
config();
import { writeFile, readFile, copyFile } from 'node:fs/promises';
import configSchema from '../schemas/config';

(async () => {
  if (!existsSync('config.json')) {
    await copyFile('config.example.json', 'config.json');
    console.log('Generated a new config.json, edit it and run this command again');
    process.exit();
  }

  let envContents = '';
  if (!existsSync('.env')) {
    envContents = await readFile('.env.example', 'utf-8');
  } else {
    envContents = await readFile('.env', 'utf-8');
  }

  const configData = configSchema.parse(JSON.parse(await readFile('config.json', 'utf-8')));

  const configBase64 = Buffer.from(JSON.stringify(configData)).toString('base64');
  envContents = envContents.replace(new RegExp(`CONFIG=(.*)`), `CONFIG="${configBase64}"`);

  await writeFile('.env', envContents);
  console.log('Updated env file');
})();
