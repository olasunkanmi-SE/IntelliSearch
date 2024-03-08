import express from "express";
import { EmbeddingHandler } from "../handlers/embed.handler";
import { Result } from "../lib/result";
import { documentRequestSchema } from "../lib/validation-schemas";
export class EmbedController {
  path = "/embed";
  router = express.Router();
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(this.path, this.createDocumentEmbed);
  }

  async createDocumentEmbed(req: express.Request): Promise<Result<any>> {
    const embeddingHandler: EmbeddingHandler = new EmbeddingHandler();
    const { title, documentType, domain } = documentRequestSchema.parse(req.body);
    return await embeddingHandler.handle({ title, documentType, domain });
  }
}
