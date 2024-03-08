import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { ICreateEmbeddingRequestDTO } from "../repositories/dtos/dtos";
import { EmbeddingRepository } from "../repositories/embedding.repository";

export class EmbeddingHandler
  implements IRequestHandler<ICreateEmbeddingRequestDTO, Result<any>>
{
  async handle(request: ICreateEmbeddingRequestDTO): Promise<Result<any>> {
    const { title, documentType, domain } = request;
    const embeddingRepository = new EmbeddingRepository();
    const documentEmbedding =
      await embeddingRepository.createDocumentsAndEmbeddings(
        title,
        documentType,
        domain,
      );
    if (documentEmbedding) {
      console.log("success");
      return new Result(true, true);
    }
  }
}
