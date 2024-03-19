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
    // this.createIvfflatIndex();
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
      const exists = await this.prisma.embeddings.findFirst();
      if (exists) {
        await this.prisma.$queryRaw`
             CREATE INDEX IF NOT EXISTS "Embeddings_textEmbedding_idx" 
                 ON "Embeddings"
                 USING ivfflat ("textEmbedding" vector_cosine_ops) 
                 WITH (lists = 100);
          `;
      }
    } catch (error) {
      console.error("Error creating index or extension", error);
    }
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
