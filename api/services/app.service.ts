import { CONSTANTS } from "../core/constants";
import { IDocumentService } from "../interfaces/document-service.interface";
import { IEmbeddingService } from "../interfaces/embedding-service.interface";
import { DocumentService } from "./document-service";
import { EmbeddingService } from "./embed-service";
import { database } from "..";

export class AppService {
  constructor(private readonly APIkey: string, private readonly documentPath: string) {}
  async createEmbeddings(): Promise<void> {
    const documentService: IDocumentService = new DocumentService();
    const embeddingService: IEmbeddingService = new EmbeddingService(this.APIkey, CONSTANTS.generativeAIModel);
    let text: string;
    if (this.documentPath.length) {
      text = await documentService.convertPDFToText(this.documentPath);
    }
    if (text) {
      console.log("...generating embeddings");
      const embeddings = await embeddingService.generateEmbeddings(text);
      if (embeddings) {
        console.log("...embeddings generated");
        return await database.createDocument(text, embeddings);
      }
    }
  }
}
