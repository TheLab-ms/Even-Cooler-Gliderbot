#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Check if the .env file exists and if not copy it from .env.example
if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
  fs.copyFileSync(path.join(process.cwd(), '.env.example'), path.join(process.cwd(), '.env'));
}

// Chedk if the printerconfig.json file exists if not copy it from printerconfig.example.json
if (!fs.existsSync(path.join(process.cwd(), 'config.json'))) {
  fs.copyFileSync(
    path.join(process.cwd(), 'config.example.json'),
    path.join(process.cwd(), 'config.json'),
  );
  return;
}

const config = require('../config.json');
const envFilePath = path.join(process.cwd(), '.env');
// Take config Stringify it and base64 encode it
const configBase64 = Buffer.from(JSON.stringify(config)).toString('base64');

const variableName = 'CONFIG';

// Read the content of the .env file
fs.readFile(envFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Update the value of the variable or add it if it doesn't exist
  const updatedData = data.replace(
    new RegExp(`${variableName}=(.*)`),
    `${variableName}="${configBase64}"`,
  );

  // Write the updated content back to the .env file
  fs.writeFile(envFilePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Variable updated successfully!');
  });
});
