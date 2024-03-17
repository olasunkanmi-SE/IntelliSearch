import { TaskType } from "@google/generative-ai";
import { IDocumentService } from "../interfaces/document-service.interface";
import { DocumentService } from "./document.service";
import { EmbeddingService } from "./embed.service";
import { IAppService } from "../interfaces/app-service.interface";
import { HttpException } from "../exceptions/exception";
import { AiModels, HTTP_RESPONSE_CODE } from "../lib/constants";
import { getValue } from "../utils";

export class AppService implements IAppService {
  constructor(private readonly documentPath: string) {}
  async createContentEmbeddings(): Promise<{ text: string; embeddings?: number[] }[]> {
    const documentService: IDocumentService = new DocumentService();
    let text: string;
    if (!this.documentPath.length) {
      throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Could not read PDF file");
    }
    //convert chunks to text instead, incase the file is too large
    text = await documentService.convertPDFToText(this.documentPath);
    const chunks: string[] = documentService.breakTextIntoChunks(text, 4000);

    const textMap = chunks.reduce((map, chunk, index) => {
      map.set(index, { text: chunk });
      return map;
    }, new Map<number, { text: string; embeddings?: number[] }>());
    const apiKey: string = getValue("API_KEY");
    const aiModel: string = AiModels.embedding;
    const embeddingService: EmbeddingService = new EmbeddingService(apiKey, aiModel);
    const contentEmbed = chunks.map(
      async (chunk) => await embeddingService.generateEmbeddings(chunk, TaskType.RETRIEVAL_DOCUMENT, "context")
    );

    const embeddings: number[][] = await Promise.all(contentEmbed);

    if (embeddings?.length) {
      embeddings.forEach((embedding, i) => {
        if (textMap.has(i)) {
          textMap.set(i, { ...textMap.get(i), embeddings: embedding });
        }
      });
      return [...textMap.values()];
    }
  }
}
