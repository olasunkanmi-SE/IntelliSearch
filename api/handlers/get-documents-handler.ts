import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { DocumentRepository } from "../repositories/document.repository";
import { IDocumentModel } from "../repositories/model";

export class GetDocumentsHandler implements IRequestHandler<{}, Result<IDocumentModel[]>> {
  async handle(): Promise<Result<IDocumentModel[]>> {
    try {
      const documentRespository: DocumentRepository = new DocumentRepository();
      const response: IDocumentModel[] = await documentRespository.getDocuments();
      return Result.ok(response);
    } catch (error) {
      console.error(error);
    }
  }
}
