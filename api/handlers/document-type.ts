import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { DocumentTypeRepository } from "../repositories/document-type.repository";
import { ICreateDocumentTypeRequestDTO } from "../repositories/dtos/dtos";
import { IDocumentTypeModel } from "../repositories/model";

export class DocumentTypeHandler implements IRequestHandler<ICreateDocumentTypeRequestDTO, Result<IDocumentTypeModel>> {
  async handle(request: ICreateDocumentTypeRequestDTO): Promise<Result<IDocumentTypeModel>> {
    const { name } = request;
    const documentTypeRepository: DocumentTypeRepository = new DocumentTypeRepository();
    const domain = await documentTypeRepository.create(name);
    return Result.ok(domain);
  }
}
