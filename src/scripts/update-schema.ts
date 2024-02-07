import { zodToJsonSchema } from 'zod-to-json-schema';
import configSchema from '../schemas/config';
import { writeFileSync } from 'fs';

const jsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  id: 'https://thelab.ms/schema/config.json',
  title: 'TheLab.ms Config',
  ...zodToJsonSchema(configSchema),
};

writeFileSync('.vscode/schemas/config.schema.json', JSON.stringify(jsonSchema, null, 2), 'utf-8');
