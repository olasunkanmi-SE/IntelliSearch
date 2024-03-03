import { TaskType } from "@google/generative-ai";
import { IDocumentService } from "../interfaces/document-service.interface";
import { DocumentService } from "./document-service";
import { EmbeddingService } from "./embed-service";
import { IAppService } from "../interfaces/app-service.interface";

export class AppService extends EmbeddingService implements IAppService {
  constructor(apikey: string, private readonly documentPath: string, AIModel: string) {
    super(apikey, AIModel);
  }
  async createContentEmbeddings(): Promise<any> {
    const documentService: IDocumentService = new DocumentService();
    let text: string;
    if (!this.documentPath.length) {
      throw new Error("Could not read PDF file");
    }
    let contentEmbed: Promise<number[]>[];
    text = await documentService.convertPDFToText(this.documentPath);
    //get each chuch and embedding. Loop through, create an obj { index, chunk}
    const chunks: string[] = documentService.breakTextIntoChunks(text, 4000);
    const textMap = chunks.reduce((map, chunk, index) => {
      map.set(index, { text: chunk });
      return map;
    }, new Map<number, { text: string; embeddings?: number[] }>());
    if (chunks.length) {
      contentEmbed = chunks.map((chunk) => this.generateEmbeddings(chunk, TaskType.RETRIEVAL_DOCUMENT, "context"));
    }
    const embeddings: number[][] = await Promise.all(contentEmbed);
    if (embeddings) {
      //use for of instead
      for (let i = 0; i < embeddings.length; i++) {
        if (textMap.has(i)) {
          textMap.set(i, { ...textMap.get(i), embeddings: embeddings[i] });
        }
      }
      //find a way to remove the id, from the array Array.from(textMap);
      //After this you can write to the DB
      const x = Array.from(textMap);
      console.log(JSON.stringify(x));
    }
  }
}

//Add text to embedding table
