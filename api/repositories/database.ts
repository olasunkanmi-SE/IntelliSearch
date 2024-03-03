import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export class Database {
  prisma: PrismaClient<Prisma.PrismaClientOptions, { log: "info" }, DefaultArgs>;
  constructor() {
    this.prisma = new PrismaClient();
  }
}
