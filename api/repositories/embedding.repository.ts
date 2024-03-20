import { ICreateEmbedding, IQueryMatch } from "../interfaces/generic-interface";
import { Result } from "../lib/result";
import { Database } from "./database";
import { ICreateEmbeddingDTO } from "./dtos/dtos";
import { IEmbeddingModel } from "./model";

export class EmbeddingRepository extends Database {
  constructor() {
    super();
  }

  async createEmbedding(props: ICreateEmbeddingDTO): Promise<number> {
    try {
      const { context, textEmbedding, documentId, domainId, documentTypeId } = props;
      const embedding = await this.prisma.$executeRaw`
        INSERT INTO "Embeddings" (
          "context",
          "textEmbedding",
          "documentId",
          "domainId",
          "documentTypeId"
        )
        VALUES (
          ${context.toString()},
          ${textEmbedding}::vector,
          ${documentId},
          ${domainId},
          ${documentTypeId}
        )
        RETURNING *;
      `;
      return embedding;
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: number) {
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

  async findFirst() {
    try {
      return await this.prisma.embeddings.findFirst();
    } catch (error) {
      console.error(error);
    }
  }

  async insertMany(props: IEmbeddingModel[]): Promise<{ count: number }> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        let transactionCount = 0;
        const embeddings: Promise<number>[] = props.map((prop) => this.createEmbedding(prop));
        const allPromise: number[] = await Promise.all(embeddings);
        if (allPromise.length) {
          transactionCount = allPromise.length;
        }
        return {
          count: transactionCount,
        };
      });
    } catch (error) {
      console.error(error);
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
  async createDocumentEmbeddings(data: ICreateEmbedding): Promise<Result<boolean>> {
    try {
      let response = Result.ok<boolean>(true);

      await this.prisma.$transaction(async (prisma) => {
        const { documentEmbeddings, documentId, documentTypeId, domainId } = data;
        const embeddingModels: IEmbeddingModel[] = this.createEmbeddingModelMapper(
          documentEmbeddings,
          documentId,
          documentTypeId,
          domainId
        );
        const embeddings = await this.insertMany(embeddingModels);
        if (embeddings?.count < 1) {
          response = Result.fail<boolean>("Unable to create embeddings", 400);
        }
      });
      return response;
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
  private createEmbeddingModelMapper(
    documentEmbeddings: { text: string; embedding?: number[] }[],
    documentId: number,
    documentTypeId: number,
    domainId: number
  ): IEmbeddingModel[] {
    return documentEmbeddings.map((doc) => ({
      textEmbedding: doc.embedding,
      context: doc.text,
      documentId,
      documentTypeId,
      domainId,
    }));
  }

  /**
   * Queries the database for listings that are similar to a given embedding.
   */
  async matchDocuments(embedding: any, matchCount: number, matchThreshold: number): Promise<IQueryMatch[]> {
    //change text to document_embedding
    //check how to select textembedding from DB
    const matches = await this.prisma.$queryRaw`
        SELECT 
        context,
            1 - ("textEmbedding" <=> ${embedding}::vector) as similarity
        FROM 
            "Embeddings"
        WHERE 
            1 - ("textEmbedding" <=> ${embedding}::vector) > ${matchThreshold}
        ORDER BY 
            similarity DESC
        LIMIT 
            ${matchCount};
    `;
    return matches as IQueryMatch[];
  }
}
