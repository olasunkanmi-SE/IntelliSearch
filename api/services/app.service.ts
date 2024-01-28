import { DataBase } from "./../database";
import { CONSTANTS } from "../core/constants";
import { IDocumentService } from "../interfaces/document-service.interface";
import { IEmbeddingService } from "../interfaces/embedding-service.interface";
import { DocumentService } from "./document-service";
import { EmbeddingService } from "./embed-service";

export class AppService {
  constructor(private readonly APIkey: string, private readonly documentPath: string) {}
  async createEmbeddings() {
    let embeddings: number[];
    let document: boolean;
    const documentService: IDocumentService = new DocumentService();
    const embeddingService: IEmbeddingService = new EmbeddingService(this.APIkey, CONSTANTS.generativeAIModel);
    let text: string;
    if (this.documentPath.length) {
      text = await documentService.convertPDFToText(this.documentPath);
    }
    if (text) {
      console.log("...generating embeddings");
      embeddings = await embeddingService.generateEmbeddings(text);
      if (embeddings) {
        console.log("...embeddings generated");
        const database = new DataBase();
        document = await database.createDocument(text, embeddings);
      }
    }
    return document;
  }
}
