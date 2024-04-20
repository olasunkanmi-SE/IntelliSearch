import { Prisma } from "@prisma/client";
import { Database } from "./database";
import { IDocumentModel } from "./model";
import { HttpException } from "../exceptions/exception";
import { HTTP_RESPONSE_CODE } from "../lib/constants";

export class DocumentRepository extends Database {
  constructor() {
    super();
  }

  async create(title: string): Promise<IDocumentModel> {
    try {
      //Todo do not rely on the document title alone, you can concatenate some property called slug and query against that
      //Or use composite key instead
      //Try out https://github.com/robbie-cahill/tunnelmole-client for locally running http server
      //In your instructiona prompt, ask the AI to genrate code if any is available
      const docExists: IDocumentModel = await this.findOne(title);
      if (docExists) {
        throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "document already exists");
      }
      return await this.prisma.documents.create({
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
      return await this.prisma.documents.findFirst({
        where: {
          title,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getDocuments(): Promise<IDocumentModel[]> {
    try {
      return await this.prisma.documents.findMany();
    } catch (error) {
      console.error(error);
    }
  }

  async insertMany(): Promise<Prisma.PrismaPromise<{ count: number }>> {
    try {
      const result = await this.prisma.documents.createMany();
      return result.count > 0 ? result : { count: 0 };
    } catch (error) {
      console.error("unable to insert many docs", error);
    }
  }
}
