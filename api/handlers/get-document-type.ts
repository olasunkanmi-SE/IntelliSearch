import { DocumentTypeRepository } from "./../repositories/document-type.repository";
import { IRequestHandler } from "../interfaces/handler";
import { IDocumentTypeModel } from "../repositories/model";
import { Result } from "../lib/result";

export class GetDocumentTypeHandler implements IRequestHandler<{}, Result<IDocumentTypeModel[]>> {
  async handle(): Promise<Result<IDocumentTypeModel[]>> {
    const documentTypeRepository: DocumentTypeRepository = new DocumentTypeRepository();
    const response: IDocumentTypeModel[] = await documentTypeRepository.getDocumentType();
    return Result.ok(response);
  }
}
