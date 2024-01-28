import { Client } from "pg";
import { config } from "./core/db-config";
import { dbQuery } from "./query";
import { AppError } from "./core/error";

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
    const createDocument = dbQuery.CREATE_DOCUMENT_TABLE;
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

  async createDocument(content: string, embedding: number[]): Promise<boolean> {
    const query = dbQuery.INSERT_INTO_DOCUMENT_TABLE;
    try {
      const result = await this.client.query(query, [content, embedding]);
      if (result.rowCount > 0) {
        return true;
      }
    } catch (error) {
      console.error("Error inserting document into DB", error);
    }
  }
}
