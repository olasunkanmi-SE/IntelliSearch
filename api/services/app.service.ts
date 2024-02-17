import { IDocumentService } from "../interfaces/document-service.interface";
import { DocumentService } from "./document-service";
import { EmbeddingService } from "./embed-service";
import { database } from "..";
import { TaskType } from "@google/generative-ai";

export class AppService extends EmbeddingService {
  constructor(apikey: string, private readonly documentPath: string, AIModel: string) {
    super(apikey, AIModel);
  }
  async createContentEmbeddings(): Promise<void> {
    const documentService: IDocumentService = new DocumentService();
    let text: string;
    if (this.documentPath.length) {
      text = await documentService.convertPDFToText(this.documentPath);
    }
    if (text) {
      console.log("...generating embeddings");
      const embeddings = await this.generateEmbeddings(text, TaskType.RETRIEVAL_DOCUMENT);
      if (embeddings) {
        console.log("...embeddings generated");
        return await database.createDocument(text, embeddings);
      }
    }
  }

  // async search(prompt: string) {
  //   const embedding = this.generateEmbeddings(prompt);
  // }
}
