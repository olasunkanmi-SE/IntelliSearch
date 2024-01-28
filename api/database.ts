import { Client, ClientConfig } from "pg";
import { config } from "./db-config";
import { dbQuery } from "./query";
import { AppError } from "./error";

export class DataBase {
  client: Client;
  constructor() {
    this.client = new Client(config());
    this.createVector();
    this.createDocumentsTable();
  }

  async createVector() {
    try {
      await this.client.query(dbQuery.CREATE_VECTOR);
    } catch (error) {
      console.error(AppError.VectorCreationError, error);
    }
  }

  async createDocumentsTable() {
    const createDocument = dbQuery.CREATE_TABLE;
    try {
      await this.client.query(createDocument);
    } catch (error) {
      console.error(AppError.CreateDocumentError(createDocument), error);
    }
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error(AppError.dbConnectionError, error);
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log("Disconnected from the database.");
    } catch (err) {
      console.error(AppError.dbDisconnectError, err);
    }
  }
}
