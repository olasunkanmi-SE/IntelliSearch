import * as express from "express";
import { Result } from "../lib/result";
import { docTypeRequestSchema } from "../lib/validation-schemas";
import { generateErrorResponse } from "../utils/utils";
import { DocumentTypeHandler } from "./../handlers/create-document-type";
import { GetDocumentTypeHandler } from "./../handlers/get-document-type";
export class DocmentTypeController {
  path = "/document/type";
  router = express.Router();
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}/create`, this.createDocumentType);
    this.router.get(`${this.path}`, this.getDocumentType);
  }

  async createDocumentType(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { name } = docTypeRequestSchema.parse(req.body);
      const documentTypeHandler = new DocumentTypeHandler();
      const data = await documentTypeHandler.handle({ name });
      if (data) {
        const result = Result.ok(data.getValue());
        res.status(200).json(result);
      } else {
        res.status(400).json(Result.fail("Unable to create document type", 400));
      }
    } catch (error) {
      generateErrorResponse(error, res, next);
    }
  }

  async getDocumentType(req: express.Request, res: any, next: express.NextFunction) {
    try {
      const getDocumentTypeHandler: GetDocumentTypeHandler = new GetDocumentTypeHandler();
      const data = await getDocumentTypeHandler.handle();
      if (data) {
        const result = Result.ok(data.getValue());
        return res.status(200).json(result);
      }
      return res.status(400).json(Result.fail("Unable to retrieve document types", 400));
    } catch (error) {
      generateErrorResponse(error, res, next);
      next(error);
    }
  }
}
