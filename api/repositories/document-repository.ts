import { Prisma } from "@prisma/client";
import { Database } from "./database";
import { IDocumentModel } from "./model";

export class DocumentRepository extends Database {
  constructor() {
    super();
  }

  async create(title: string): Promise<IDocumentModel> {
    try {
      const docExists: IDocumentModel = await this.findOne(title);
      if (docExists) {
        throw new Error("document already exists");
      }
      return await this.prisma.document.create({
        data: {
          title,
        },
      });
    } catch (error) {
      console.error("Unable to create doc", error);
    }
  }

  async findOne(title: string): Promise<IDocumentModel> {
    try {
      return await this.prisma.document.findFirst({
        where: {
          title,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async insertMany(): Promise<Prisma.PrismaPromise<{ count: number }>> {
    try {
      const result = await this.prisma.document.createMany();
      return result.count > 0 ? result : { count: 0 };
    } catch (error) {
      console.error("unable to insert many docs", error);
    }
  }
}
