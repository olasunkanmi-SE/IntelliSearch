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
import { AiModels, DocumentTypeEnum, DomainEnum } from "../lib/constants";
import { DocumentTypeRepository } from "./document-type.repository";
import { DomainRepository } from "./domain.repository";

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
        throw new Error("Unable to create embedding");
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

  async createDocumentsAndEmbeddings(
    title: string,
    documentType: DocumentTypeEnum,
    domain: DomainEnum,
  ): Promise<boolean> {
    try {
      const filePath: string = getValue("PDF_ABSOLUTE_PATH");
      const apiKey: string = getValue("API_KEY");
      const aiModel: string = AiModels.embedding;

      const documentRepository: DocumentRepository = new DocumentRepository();
      const documentRepositoryType: DocumentTypeRepository =
        new DocumentTypeRepository();
      const domainRepository: DomainRepository = new DomainRepository();

      const appService = new AppService(apiKey, filePath, aiModel);

      await this.prisma.$transaction(async (prisma) => {
        const docType: IDocumentTypeModel | undefined =
          await this.getDocumentType(documentRepositoryType, documentType);
        const documentTypeId: number = docType.id;

        const docDomain: IDomainModel | undefined = await this.getDomain(
          domainRepository,
          domain,
        );
        const domainId: number = docDomain.id;

        const document: IDocumentModel = await documentRepository.create(title);
        const documentId: number = document.id;

        const documentEmbeddings: { text: string; embeddings?: number[] }[] =
          await appService.createContentEmbeddings();
        if (!documentEmbeddings?.length) {
          throw new Error("Unable to create document embeddings");
        }

        const embeddingModels: IEmbeddingModel[] = this.createEmbeddingModels(
          documentEmbeddings,
          documentId,
          documentTypeId,
          domainId,
        );

        await this.insertMany(embeddingModels);
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private async getDocumentType(
    documentRepositoryType: DocumentTypeRepository,
    documentType: DocumentTypeEnum,
  ): Promise<IDocumentTypeModel> {
    let docType: IDocumentTypeModel | undefined;
    if (Object.values(DocumentTypeEnum).includes(documentType)) {
      docType = await documentRepositoryType.findOne(documentType);
    }
    if (!docType) {
      throw new Error("Document type doesn't exist");
    }
    return docType;
  }

  private async getDomain(
    domainRepository: DomainRepository,
    domain: DomainEnum,
  ): Promise<IDomainModel> {
    let docDomain: IDomainModel | undefined;
    if (Object.values(DomainEnum).includes(domain)) {
      docDomain = await domainRepository.findOne(domain);
    }
    if (!docDomain) {
      throw new Error("Domain doesn't exist");
    }
    return docDomain;
  }

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
