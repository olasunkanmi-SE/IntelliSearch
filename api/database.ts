import { Client } from "pg";

const dbConfig = {
  host: "localhost",
  port: 35000,
  database: "embedding",
  user: "postgres",
  password: "postgres1",
};

export class DataBase {
  client: Client;
  constructor() {
    this.client = new Client(dbConfig);
    this.client.query("CREATE EXTENSION IF NOT EXISTS vector;");
  }

  connect() {
    return this.client.connect();
  }
}
