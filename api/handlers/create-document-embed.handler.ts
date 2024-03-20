import { HttpException } from "../exceptions/exception";
import { IRequestHandler } from "../interfaces/handler";
import { HTTP_RESPONSE_CODE } from "../lib/constants";
import { Result } from "../lib/result";
import { ICreateEmbeddingRequestDTO } from "../repositories/dtos/dtos";
import { GenerativeAIService } from "../services/ai.service";
import { ChatService } from "../services/chat.service";
import { EmbeddingService } from "../services/embed.service";
import { getValue } from "../utils";

export class CreateDocumentEmbeddingHandler implements IRequestHandler<ICreateEmbeddingRequestDTO, Result<boolean>> {
  private readonly apiKey: string = getValue("API_KEY");
  embeddingService: EmbeddingService = new EmbeddingService(this.apiKey);
  async handle(request: ICreateEmbeddingRequestDTO): Promise<Result<boolean>> {
    try {
      const { title, documentType, domain } = request;
      this.startConversation();
      const result = await this.embeddingService.createDocumentsEmbeddings(title, documentType, domain);
      if (!result) {
        throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "An error occured, could not create embeddings");
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async startConversation() {
    const matches = await this.embeddingService.getQueryMatches(
      "What is digital identity and traditional identification",
      4,
      0.6
    );
    if (!matches?.length) {
      return "No matches for user query";
    }
    const context: string = matches.map((match) => match.context).join(" ,");
    const questions: string[] = [
      "What is digital identity and traditional identification",
      "How can the government leverage this technology, give your answers in bullet points",
      "How can the myBid project help to solve some of this traditional identification issues",
    ];
    const chatService: ChatService = new ChatService(this.apiKey, { context, questions });
    chatService.run();
  }
}
