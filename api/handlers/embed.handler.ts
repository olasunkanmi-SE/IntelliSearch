import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { ICreateEmbeddingRequestDTO } from "../repositories/dtos/dtos";
import { EmbeddingRepository } from "../repositories/embedding.repository";

export class EmbeddingHandler
  implements IRequestHandler<ICreateEmbeddingRequestDTO, Result<boolean>>
{
  async handle(request: ICreateEmbeddingRequestDTO): Promise<Result<boolean>> {
    try {
      const { title, documentType, domain } = request;
      const embeddingRepository = new EmbeddingRepository();
      return await embeddingRepository.createDocumentsAndEmbeddings(
        title,
        documentType,
        domain,
      );
    } catch (error) {
      console.error(error);
    }
  }
}
