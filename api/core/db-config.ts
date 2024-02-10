import { ClientConfig } from "pg";
import { getValue } from "../utils";

export const config = (): ClientConfig => {
  return {
    host: getValue("HOST"),
    port: Number(getValue("PGPORT")),
    database: getValue("DATABASE_NAME"),
    user: getValue("DATABASE_USER"),
    password: getValue("DATABASE_PASSWORD"),
  };
};
