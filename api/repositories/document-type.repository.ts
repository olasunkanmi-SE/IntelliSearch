import { Prisma } from "@prisma/client";
import { Database } from "./database";
import { IDocumentTypeModel } from "./model";
import { DocumentTypeEnum, HTTP_RESPONSE_CODE } from "../lib/constants";
import { HttpException } from "../exceptions/exception";

export class DocumentTypeRepository extends Database {
  instance: DocumentTypeRepository;
  constructor() {
    super();
  }

  async create(name: DocumentTypeEnum): Promise<IDocumentTypeModel> {
    try {
      const exists: IDocumentTypeModel = await this.findOne(name);
      if (exists) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          "document type already exists",
        );
      }
      return await this.prisma.documentTypes.create({
        data: {
          name,
        },
      });
    } catch (error) {
      console.error("Unable to create doc", error);
    }
  }

  async findOne(name: DocumentTypeEnum): Promise<IDocumentTypeModel> {
    try {
      return await this.prisma.documentTypes.findFirst({
        where: {
          name,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async insertMany(): Promise<Prisma.PrismaPromise<{ count: number }>> {
    try {
      const result = await this.prisma.documentTypes.createMany();
      return result.count > 0 ? result : { count: 0 };
    } catch (error) {
      console.error("unable to insert many docs", error);
    }
  }
}
