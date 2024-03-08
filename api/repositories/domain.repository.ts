import { Prisma } from "@prisma/client";
import { DomainEnum, HTTP_RESPONSE_CODE } from "../lib/constants";
import { Database } from "./database";
import { IDomainModel } from "./model";
import { HttpException } from "../exceptions/exception";

export class DomainRepository extends Database {
  constructor() {
    super();
  }

  async create(name: DomainEnum): Promise<IDomainModel> {
    try {
      const exists: IDomainModel = await this.findOne(name);
      if (exists) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          "domain already exists",
        );
      }
      return await this.prisma.domains.create({
        data: {
          name,
        },
      });
    } catch (error) {
      console.error("Unable to create doc", error);
    }
  }

  async findOne(name: DomainEnum): Promise<IDomainModel> {
    try {
      return await this.prisma.domains.findFirst({
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
      const result = await this.prisma.domains.createMany();
      return result.count > 0 ? result : { count: 0 };
    } catch (error) {
      console.error("unable to insert many docs", error);
    }
  }
}
