import * as express from "express";
import { CreateDomainHandler } from "../handlers/create-domain.handler";
import { Result } from "../lib/result";
import { domainRequestSchema } from "../lib/validation-schemas";
import { generateErrorResponse } from "../utils/utils";
import { GetDomainHandler } from "../handlers/get-domain-handler";
export class DomainController {
  path = "/domain";
  router = express.Router();
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}/create`, this.createDomain);
    this.router.get(`${this.path}`, this.getDocumentDomain);
  }

  async createDomain(req: express.Request, res: any, next: express.NextFunction): Promise<void> {
    try {
      const { name } = domainRequestSchema.parse(req.body);
      const domainHandler = new CreateDomainHandler();
      const data = await domainHandler.handle({ name });
      if (data.isSuccess) {
        const result = Result.ok(data.getValue());
        return res.status(200).json(result);
      }
      return res.status(400).json(Result.fail("Unable to create domain", 400));
    } catch (error) {
      generateErrorResponse(error, res, next);
      next(error);
    }
  }

  async getDocumentDomain(req: express.Request, res: any, next: express.NextFunction) {
    try {
      const domainHandler = new GetDomainHandler();
      const data = await domainHandler.handle();
      if (data.isSuccess) {
        const result = Result.ok(data.getValue());
        return res.status(200).json(result);
      }
      return res.status(400).json(Result.fail("Unable to retrieve document domain", 400));
    } catch (error) {
      generateErrorResponse(error, res, next);
      next(error);
    }
  }
}
