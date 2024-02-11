import { Client } from "pg";
import { config } from "./core/db-config";
import { AppError } from "./core/error";
import { GenericSQLRepository } from "./repositories/generic-sql-repository";

export class DataBase {
  client: Client;
  genericRepository: GenericSQLRepository;
  constructor() {
    this.client = new Client(config());
    this.genericRepository = new GenericSQLRepository();
  }

  async createVector() {
    try {
      await this.genericRepository.createVectorExtension();
    } catch (error) {
      console.error(AppError.VectorCreationError, error);
    }
  }

  async createEmbeddingIndex() {
    try {
      await this.genericRepository.createIvfflatIndex();
    } catch (error) {
      console.error("An error occured while the ivfflat index", error);
    }
  }

  async documentExists() {
    try {
      return await this.genericRepository.checkDocumentsExists();
    } catch (error) {
      console.error("An error occured while checking for documents", error);
    }
  }

  async createDocumentsTable() {
    try {
      await this.genericRepository.createDocumentTable();
    } catch (error) {
      console.error("An error occured while creating the document table", error);
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

  async createDocument(content: string, embedding: number[]) {
    try {
      await this.genericRepository.insertDocument(content, JSON.stringify(embedding));
    } catch (error) {
      console.log("an error occured while creating embeddings", error);
    }
  }
}
