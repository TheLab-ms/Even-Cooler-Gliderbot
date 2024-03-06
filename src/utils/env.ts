import { config } from "dotenv";
import envSchema from "../schemas/env";
config();

const env = envSchema.parse(process.env);

export default env;
