import { HttpException } from "../exceptions/exception";
import { IRequestHandler } from "../interfaces/handler";
import { HTTP_RESPONSE_CODE } from "../lib/constants";
import { Result } from "../lib/result";
import { ICreateEmbeddingRequestDTO } from "../repositories/dtos/dtos";
import { EmbeddingService } from "../services/embed.service";
import { getValue } from "../utils";

export class CreateDocumentEmbeddingHandler
  implements IRequestHandler<ICreateEmbeddingRequestDTO, Result<boolean>>
{
  async handle(request: ICreateEmbeddingRequestDTO): Promise<Result<boolean>> {
    try {
      const { title, documentType, domain } = request;
      const apiKey: string = getValue("API_KEY");
      const embeddingService: EmbeddingService = new EmbeddingService(apiKey);
      const result = await embeddingService.createDocumentsEmbeddings(
        title,
        documentType,
        domain,
      );
      if (!result) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          "An error occured, could not create embeddings",
        );
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
