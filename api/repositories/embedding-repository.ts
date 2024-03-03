import { Prisma } from "@prisma/client";
import { Database } from "./database";
import { ICreateEmbeddingDTO } from "./dtos";
import { IEmbeddingModel } from "./model";

export class EmbeddingRepository extends Database {
  constructor() {
    super();
  }

  async create(props: ICreateEmbeddingDTO): Promise<IEmbeddingModel> {
    try {
      const { text, vector, documentId } = props;
      const embedding = await this.prisma.embedding.create({
        data: {
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

  async insertMany(): Promise<Prisma.PrismaPromise<{ count: number }>> {
    try {
      const result = await this.prisma.embedding.createMany();
      return result.count > 0 ? result : { count: 0 };
    } catch (error) {
      console.error("unable to insert many docs", error);
    }
  }
}
