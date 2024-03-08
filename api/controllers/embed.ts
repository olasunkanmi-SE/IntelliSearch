import express from "express";
import { documentRequestSchema } from "../lib/validation-schemas";
import { EmbeddingRepository } from "../repositories/embedding.repository";
export class EmbedController {
  path = "/embed";
  router = express.Router();
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(this.path, this.createDocumentEmbed);
  }

  async createDocumentEmbed(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const embeddingRepository = new EmbeddingRepository();
    const { title, documentType, domain } = documentRequestSchema.parse(req.body);
    const documentEmbedding =
      await embeddingRepository.createDocumentsAndEmbeddings(title, documentType, domain);
    if (documentEmbedding) {
      console.log("success");
    }
  }
}
