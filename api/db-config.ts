import { ClientConfig } from "pg";

export const config = (): ClientConfig => {
  const envProcess = (props: string) => process.env[props];
  return {
    host: envProcess("HOST"),
    port: Number(envProcess("PGPORT")),
    database: envProcess("DATABASE_NAME"),
    user: envProcess("DATABASE_USER"),
    password: envProcess("DATABASE_PASSWORD"),
  };
};
