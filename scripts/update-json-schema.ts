import fs from 'fs';
import path from 'path';

import { zodToJsonSchema } from 'zod-to-json-schema';
import configSchema from '../src/schemas/config';

const jsonSchema = zodToJsonSchema(configSchema, 'config');
// @ts-ignore
const properties = jsonSchema.definitions['config']['properties'];

const fileContents = {
  $schema: jsonSchema.$schema,
  $id: 'https://thelab.ms/schema/config.json',
  title: 'TheLab.ms Config Schema',
  description: 'TheLab.ms Config Schema',
  type: 'object',
  properties,
};

fs.writeFile(
  path.join(__dirname, '../.vscode/schemas/config.schema.json'),
  JSON.stringify(fileContents, null, 2),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Schema file has been updated');
  },
);
