import * as express from "express";
import { CreateDocumentEmbeddingHandler } from "../handlers/create-document-embed.handler";
import { documentRequestSchema } from "../lib/validation-schemas";
import { generateErrorResponse } from "../utils/utils";
import { Result } from "../lib/result";
export class EmbeddingController {
  path = "/embed";
  router = express.Router();
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}/documents`, this.createDocumentEmbeddings);
  }

  async createDocumentEmbeddings(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const embeddingHandler: CreateDocumentEmbeddingHandler =
      new CreateDocumentEmbeddingHandler();
    try {
      const { title, documentType, domain } = documentRequestSchema.parse(
        req.body,
      );
      const result = await embeddingHandler.handle({
        title,
        documentType,
        domain,
      });
      if (!result?.isSuccess) {
        return res.json(Result.fail("unable to create embeddings", 400));
      }
      return res.json(result);
    } catch (error) {
      generateErrorResponse(error, res, next);
    }
  }
}
