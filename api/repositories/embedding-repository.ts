import { Prisma } from "@prisma/client";
import { Database } from "./database";
import { ICreateEmbeddingDTO } from "./dtos";
import { IDocumentModel, IEmbeddingModel } from "./model";
import { DocumentRepository } from "./document-repository";
import { AppService } from "../services/app.service";
import { getValue } from "../utils";
import { CONSTANTS } from "../core/constants";

export class EmbeddingRepository extends Database {
  constructor() {
    super();
  }

  async create(props: ICreateEmbeddingDTO): Promise<IEmbeddingModel> {
    try {
      const { text, vector, documentId } = props;
      const embedding = await this.prisma.embedding.create({
        data: {
          text,
          vector,
          documentId,
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
      return await this.prisma.embedding.findFirst({
        where: {
          documentId: id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async insertMany(
    props: IEmbeddingModel[]
  ): Promise<Prisma.PrismaPromise<{ count: number }>> {
    try {
      const result = await this.prisma.embedding.createMany({ data: props });
      return result.count > 0 ? result : { count: 0 };
    } catch (error) {
      console.error("unable to insert many docs", error);
    }
  }

  async createDocumentAndEmbeddings(title: string) {
    try {
      const filePath: string = getValue("PDF_ABSOLUTE_PATH");
      const apiKey: string = getValue("API_KEY");
      const aiModel: string = CONSTANTS.AIModels.embedding;
      const documentRepository = new DocumentRepository();
      const appService = new AppService(apiKey, filePath, aiModel);
      await this.prisma.$transaction(async (prisma) => {
        const document: IDocumentModel = await documentRepository.create(title);
        const documentId = document.id;
        const documentEmbeddings = await appService.createContentEmbeddings();
        if (documentEmbeddings?.length) {
          const embeddingModels: IEmbeddingModel[] = documentEmbeddings.map(
            (doc) => {
              return {
                vector: JSON.stringify(doc.embeddings),
                text: doc.text,
                documentId,
              };
            }
          );
          await this.insertMany(embeddingModels);
        } else {
          console.warn("No embeddings found for the document.");
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
