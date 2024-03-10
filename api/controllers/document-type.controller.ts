import * as express from "express";
import { DocumentTypeHandler } from "../handlers/document-type";
import { Result } from "../lib/result";
import { docTypeRequestSchema } from "../lib/validation-schemas";
import { generateErrorResponse } from "../utils/utils";
export class DocmentTypeController {
  path = "/document/type";
  router = express.Router();
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}/create`, this.createDocumentType);
  }

  async createDocumentType(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const { name } = docTypeRequestSchema.parse(req.body);
      const documentTypeHandler = new DocumentTypeHandler();
      const data = await documentTypeHandler.handle({ name });
      if (data) {
        const result = Result.ok(data.getValue());
        res.status(200).json(result);
      } else {
        res
          .status(400)
          .json(Result.fail("Unable to create document type", 400));
      }
    } catch (error) {
      generateErrorResponse(error, res, next);
    }
  }
}
