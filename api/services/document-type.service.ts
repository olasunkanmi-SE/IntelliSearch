import { HttpException } from "../exceptions/exception";
import { DocumentTypeEnum, HTTP_RESPONSE_CODE } from "../lib/constants";
import { DocumentTypeRepository } from "../repositories/document-type.repository";
import { IDocumentTypeModel } from "../repositories/model";

export class DocumentTypeService {
  /**
   * Retrieves the document type model based on the provided document type enum.
   *
   * @param {DocumentTypeRepository} documentRepositoryType - The repository for document types.
   * @param {DocumentTypeEnum} documentType - The document type enum to search for.
   * @returns {Promise<IDocumentTypeModel>} - A promise that resolves to the document type model.
   * @throws {Error} - If the document type doesn't exist.
   */
  async getDocumentType(
    documentType: DocumentTypeEnum,
  ): Promise<IDocumentTypeModel> {
    try {
      let docType: IDocumentTypeModel | undefined;
      const documentTypeRepository = new DocumentTypeRepository();
      if (Object.values(DocumentTypeEnum).includes(documentType)) {
        docType = await documentTypeRepository.findOne(documentType);
      }
      if (!docType) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          "Document type doesn't exist",
        );
      }
      return docType;
    } catch (error) {
      console.error(error);
    }
  }
}
