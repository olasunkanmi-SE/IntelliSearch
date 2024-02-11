import { Client } from "pg";
import { config } from "./core/db-config";
import { AppError } from "./core/error";
import { EmbeddingRepository } from "./repositories/embedding-repository";

export class DataBase {
  client: Client;
  embeddingRepository: EmbeddingRepository;
  constructor() {
    this.client = new Client(config());
    this.embeddingRepository = new EmbeddingRepository();
  }

  async createVector() {
    try {
      await this.embeddingRepository.createVectorExtension();
    } catch (error) {
      console.error(AppError.VectorCreationError, error);
    }
  }

  async createEmbeddingIndex() {
    try {
      await this.embeddingRepository.createIvfflatIndex();
    } catch (error) {
      console.error("An error occured while the ivfflat index", error);
    }
  }

  async documentExists() {
    try {
      return await this.embeddingRepository.checkDocumentsExists();
    } catch (error) {
      console.error("An error occured while checking for documents", error);
    }
  }

  async createDocumentsTable() {
    try {
      await this.embeddingRepository.createDocumentTable();
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
      await this.embeddingRepository.insertDocument(content, JSON.stringify(embedding));
    } catch (error) {
      console.log("an error occured while creating embeddings", error);
    }
  }
}
