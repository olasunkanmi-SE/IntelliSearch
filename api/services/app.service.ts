import { TaskType } from "@google/generative-ai";
import { IDocumentService } from "../interfaces/document-service.interface";
import { DocumentService } from "./document-service";
import { EmbeddingService } from "./embed-service";
import { IAppService } from "../interfaces/app-service.interface";

export class AppService extends EmbeddingService implements IAppService {
  constructor(
    apikey: string,
    private readonly documentPath: string,
    AIModel: string,
  ) {
    super(apikey, AIModel);
  }
  async createContentEmbeddings(): Promise<
    { text: string; embeddings?: number[] }[]
  > {
    const documentService: IDocumentService = new DocumentService();
    let text: string;
    if (!this.documentPath.length) {
      throw new Error("Could not read PDF file");
    }

    text = await documentService.convertPDFToText(this.documentPath);
    const chunks: string[] = documentService.breakTextIntoChunks(text, 4000);

    const textMap = chunks.reduce((map, chunk, index) => {
      map.set(index, { text: chunk });
      return map;
    }, new Map<number, { text: string; embeddings?: number[] }>());

    const contentEmbed = chunks.map((chunk) =>
      this.generateEmbeddings(chunk, TaskType.RETRIEVAL_DOCUMENT, "context"),
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
