import * as express from "express";
import { EmbeddingHandler } from "../handlers/embed.handler";
import { Result } from "../lib/result";
import { documentRequestSchema } from "../lib/validation-schemas";
import { ZodError } from "zod";
import { generatorValidationError } from "../utils/utils";
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
    next: express.NextFunction
  ): Promise<any> {
    const embeddingHandler: EmbeddingHandler = new EmbeddingHandler();

    try {
      const { title, documentType, domain } = documentRequestSchema.parse(req.body);
      const response = await embeddingHandler.handle({
        title,
        documentType,
        domain,
      });
      return res.status(200).json(Result.ok(response));
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((issue) => generatorValidationError(issue)).join(" ");
        return res.status(400).json(Result.fail(errorMessage, 400));
      }
      console.error("An unexpected error occurred:", error);
      next(error);
    }
  }
}
