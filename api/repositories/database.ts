import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export class Database {
  private static instance: Database;
  protected prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    { log: "info" },
    DefaultArgs
  >;
  constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
