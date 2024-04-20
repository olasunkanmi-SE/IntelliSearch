import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { DocumentRepository } from "../repositories/document.repository";
import { IDocumentModel } from "../repositories/model";

export class GetDocumentsHandler implements IRequestHandler<{}, Result<IDocumentModel[]>> {
  async handle(): Promise<Result<IDocumentModel[]>> {
    try {
      let response: IDocumentModel[];
      const documentRespository: DocumentRepository = new DocumentRepository();
      response = await documentRespository.getDocuments();
      return Result.ok(response);
    } catch (error) {
      console.error(error);
    }
  }
}
