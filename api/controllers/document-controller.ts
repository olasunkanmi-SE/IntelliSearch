import * as express from "express";
import { Result } from "../lib/result";
import { generateErrorResponse } from "../utils/utils";
import { GetDocumentsHandler } from "../handlers/get-documents-handler";

export class DocumentController {
  path = "/documents";
  router = express.Router();

  constructor() {
    this.initializeRoute();
  }

  initializeRoute() {
    this.router.get(this.path, this.getDocument);
  }

  async getDocument(req: express.Request, res: any, next: express.NextFunction) {
    try {
      const documentHandler = new GetDocumentsHandler();
      const data = await documentHandler.handle();
      if (data) {
        const result = Result.ok(data.getValue());
        res.status(200).json(result);
      }
    } catch (error) {
      generateErrorResponse(error, res, next);
      next(error);
    }
  }
}
