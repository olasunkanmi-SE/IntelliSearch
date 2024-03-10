import { DocumentTypeService } from "./../services/document-type.service";
import { Prisma } from "@prisma/client";
import { Database } from "./database";
import { ICreateEmbeddingDTO } from "./dtos/dtos";
import {
  IDocumentModel,
  IDocumentTypeModel,
  IDomainModel,
  IEmbeddingModel,
} from "./model";
import { DocumentRepository } from "./document.repository";
import { AppService } from "../services/app.service";
import { getValue } from "../utils";
import {
  AiModels,
  DocumentTypeEnum,
  DomainEnum,
  HTTP_RESPONSE_CODE,
} from "../lib/constants";
import { HttpException } from "../exceptions/exception";
import { DomainService } from "../services/domain.service";
import { Result } from "../lib/result";

export class EmbeddingRepository extends Database {
  constructor() {
    super();
  }

  async create(props: ICreateEmbeddingDTO): Promise<IEmbeddingModel> {
    try {
      const { text, textEmbedding, documentId, domainId, documentTypeId } =
        props;
      const embedding = await this.prisma.embeddings.create({
        data: {
          text,
          textEmbedding,
          documentId,
          domainId,
          documentTypeId,
        },
      });
      if (!embedding) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.SERVER_ERROR,
          "Unable to create embedding",
        );
      }
      return embedding;
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: number): Promise<IEmbeddingModel> {
    try {
      return await this.prisma.embeddings.findFirst({
        where: {
          documentId: id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async insertMany(
    props: IEmbeddingModel[],
  ): Promise<Prisma.PrismaPromise<{ count: number }>> {
    try {
      const result = await this.prisma.embeddings.createMany({ data: props });
      return result.count > 0 ? result : { count: 0 };
    } catch (error) {
      console.error("unable to insert many docs", error);
    }
  }

  /**
   * Creates a new document and generates embeddings for its content.
   *
   * @param {string} title - The title of the document.
   * @param {DocumentTypeEnum} documentType - The type of the document.
   * @param {DomainEnum} domain - The domain of the document.
   * @returns {Promise<boolean>} - A promise that resolves to true if the document and embeddings are created successfully, false otherwise.
   * @throws {Error} - If the document type or domain doesn't exist, or if unable to create document embeddings.
   */
  async createDocumentsAndEmbeddings(
    title: string,
    documentType: DocumentTypeEnum,
    domain: DomainEnum,
  ): Promise<Result<boolean>> {
    try {
      const filePath: string = getValue("PDF_ABSOLUTE_PATH");
      const apiKey: string = getValue("API_KEY");
      const aiModel: string = AiModels.embedding;

      const documentRepository: DocumentRepository = new DocumentRepository();
      const domainService: DomainService = new DomainService();
      const documentTypeService: DocumentTypeService =
        new DocumentTypeService();
      let embeddings: { count: number };
      const appService = new AppService(apiKey, filePath, aiModel);

      await this.prisma.$transaction(async (prisma) => {
        const docType: IDocumentTypeModel | undefined =
          await documentTypeService.getDocumentType(documentType);
        const documentTypeId: number = docType.id;

        const docDomain: IDomainModel | undefined =
          await domainService.getDomain(domain);
        const domainId: number = docDomain.id;

        const document: IDocumentModel = await documentRepository.create(title);
        const documentId: number = document.id;
        //TODO: The file URl should be part of the request
        //Use Multer for file upload. https://github.com/expressjs/multer
        const documentEmbeddings: { text: string; embeddings?: number[] }[] =
          await appService.createContentEmbeddings();
        if (!documentEmbeddings?.length) {
          throw new HttpException(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            "Unable to create embedding",
          );
        }

        const embeddingModels: IEmbeddingModel[] = this.createEmbeddingModels(
          documentEmbeddings,
          documentId,
          documentTypeId,
          domainId,
        );

        embeddings = await this.insertMany(embeddingModels);
      });
      if (embeddings.count > 0) {
        return Result.ok<boolean>(true);
      } else {
        return Result.fail<boolean>("Unable to create embeddings", 400);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Creates embedding models from the provided document embeddings.
   *
   * @param {Array<{ text: string; embeddings?: number[] }>} documentEmbeddings - The document embeddings.
   * @param {number} documentId - The ID of the associated document.
   * @param {number} documentTypeId - The ID of the associated document type.
   * @param {number} domainId - The ID of the associated domain.
   * @returns {IEmbeddingModel[]} - An array of embedding models.
   */
  private createEmbeddingModels(
    documentEmbeddings: { text: string; embeddings?: number[] }[],
    documentId: number,
    documentTypeId: number,
    domainId: number,
  ): IEmbeddingModel[] {
    return documentEmbeddings.map((doc) => ({
      textEmbedding: JSON.stringify(doc.embeddings),
      text: doc.text,
      documentId,
      documentTypeId,
      domainId,
    }));
  }

  /**
   * Creates an index on the `vector` field of the `embedding` table using the IVF Flat algorithm.
   * The IVF Flat algorithm is a vector index that uses a flat structure to store the vectors.
   * It is designed for fast approximate nearest neighbor search.
   * The `lists` parameter specifies the number of lists to use in the index.
   * A higher number of lists will result in a more accurate index,
   * but will also increase the index size and search time.
   * https://github.com/pgvector/pgvector#indexing
   */
  async createIvfflatIndex() {
    try {
      await this.prisma.$queryRaw`
          CREATE INDEX 
          IF NOT EXISTS items_embedding_ivfflat_index
          ON embedding
          USING ivfflat (vector vector_cosine_ops)
          WITH (lists = 100);
        `;
    } catch (error) {
      console.error("Error setting index on documents", error);
    }
  }

  /**
   * Queries the database for listings that are similar to a given embedding.
   */
  async queryDocumentsBySimilarity(
    embedding: string,
    matchThreshold: number,
    matchCnt: number,
  ) {
    //change text to document_embedding
    const listings = await this.prisma.$queryRaw`
        SELECT 
            context,
            1 - (document_embedding <=> ${embedding}) as similarity
        FROM 
            Embedding
        WHERE 
            1 - (document_embedding <=> ${embedding}) > ${matchThreshold}
        ORDER BY 
            similarity DESC
        LIMIT 
            ${matchCnt};
    `;
    return listings;
  }
}
