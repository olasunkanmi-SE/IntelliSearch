import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { DocumentRepository } from "../repositories/document.repository";
import { ICreateDocumentDTO } from "../repositories/dtos/dtos";
import { IDocumentModel } from "../repositories/model";

export class CreateDocumentHandler implements IRequestHandler<ICreateDocumentDTO, Result<IDocumentModel>> {
  async handle(request: ICreateDocumentDTO): Promise<Result<IDocumentModel>> {
    try {
      let response: IDocumentModel | undefined;
      const { title } = request;
      const documentRespository: DocumentRepository = new DocumentRepository();
      response = await documentRespository.create(title);
      return response ? Result.ok(response) : undefined;
    } catch (error) {
      console.error(error);
    }
  }
}
