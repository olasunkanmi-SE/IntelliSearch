import { TaskType } from "@google/generative-ai";
import { IDocumentService } from "../interfaces/document-service.interface";
import { DocumentService } from "./document-service";
import { EmbeddingService } from "./embed-service";

export class AppService extends EmbeddingService {
  constructor(apikey: string, private readonly documentPath: string, AIModel: string) {
    super(apikey, AIModel);
  }
  async createContentEmbeddings(): Promise<number[][]> {
    const documentService: IDocumentService = new DocumentService();
    let text: string;
    if (!this.documentPath.length) {
      throw new Error("Could not read PDF file");
    }
    let contentEmbed: Promise<number[]>[];
    text = await documentService.convertPDFToText(this.documentPath);
    const chunks: string[] = documentService.breakTextIntoChunks(text, 2000);
    if (chunks.length) {
      contentEmbed = chunks.map((chunk) => this.generateEmbeddings(chunk, TaskType.RETRIEVAL_DOCUMENT, "context"));
    }
    const embeddings: number[][] = await Promise.all(contentEmbed);
    return embeddings;
  }
}
