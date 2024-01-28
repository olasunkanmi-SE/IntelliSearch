import { Client, ClientConfig } from "pg";
import { config } from "./db-config";
import { dbQuery } from "./query";

export class DataBase {
  client: Client;
  constructor() {
    this.client = new Client(config());
    this.client.query(dbQuery.CREATE_VECTOR);
  }

  connect() {
    return this.client.connect();
  }
}
