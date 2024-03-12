import * as express from "express";
import { EmbeddingHandler } from "../handlers/embed.handler";
import { documentRequestSchema } from "../lib/validation-schemas";
import { generateErrorResponse } from "../utils/utils";
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
    const embeddingHandler: EmbeddingHandler = new EmbeddingHandler();
    try {
      const { title, documentType, domain } = documentRequestSchema.parse(
        req.body,
      );
      const result = await embeddingHandler.handle({
        title,
        documentType,
        domain,
      });
      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        console.log(result);
        res.status(400).json(result);
      }
    } catch (error) {
      generateErrorResponse(error, res, next);
    }
  }
}
