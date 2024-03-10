import * as express from "express";
import { DocumentTypeHandler } from "../handlers/document-type";
import { Result } from "../lib/result";
import { docTypeRequestSchema } from "../lib/validation-schemas";
import { IDomainModel } from "../repositories/model";
import { ZodError } from "zod";
import { generatorValidationError } from "../utils/utils";
export class DocmentTypeController {
  path = "/document/type";
  router = express.Router();
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}/create`, this.createDocumentType);
  }

  async createDocumentType(req: express.Request, res: any, next: express.NextFunction): Promise<Result<IDomainModel>> {
    try {
      const { name } = docTypeRequestSchema.parse(req.body);
      const documentTypeHandler = new DocumentTypeHandler();
      const response = await documentTypeHandler.handle({ name });
      return res.status(200).json(response);
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
