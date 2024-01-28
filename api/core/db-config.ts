import { ClientConfig } from "pg";
import { getEnvValue } from "../utils";

export const config = (): ClientConfig => {
  return {
    host: getEnvValue("HOST"),
    port: Number(getEnvValue("PGPORT")),
    database: getEnvValue("DATABASE_NAME"),
    user: getEnvValue("DATABASE_USER"),
    password: getEnvValue("DATABASE_PASSWORD"),
  };
};
