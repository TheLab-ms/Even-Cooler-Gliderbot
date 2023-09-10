import { existsSync } from "node:fs";
import configSchema from "../schemas/config";

if(!existsSync("config.json")){
    const configExample = Bun.file("config.example.json");
    await Bun.write("config.json", configExample);
    console.log("Generated a new config.json, edit it and run this command again");
    process.exit();
}

let envContents = "";
if(!existsSync(".env")){
    envContents = await Bun.file(".env.example").text();
}else {
    envContents = await Bun.file('.env').text();
}

const configData = configSchema.parse(await Bun.file("config.json").json());

const configBase64 = Buffer.from(JSON.stringify(configData)).toString('base64');
envContents = envContents.replace(new RegExp(`CONFIG=(.*)`), `CONFIG="${configBase64}"`);

await Bun.write(".env", envContents);
console.log("Updated env file");
