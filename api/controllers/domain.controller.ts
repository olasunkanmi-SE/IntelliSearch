import * as express from "express";
import { DomainHandler } from "../handlers/domain.handler";
import { Result } from "../lib/result";
import { domainRequestSchema } from "../lib/validation-schemas";
import { generateErrorResponse } from "../utils/utils";
export class DomainController {
  path = "/domain";
  router = express.Router();
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}/create`, this.createDomain);
  }

  async createDomain(req: express.Request, res: any, next: express.NextFunction): Promise<void> {
    try {
      const { name } = domainRequestSchema.parse(req.body);
      const domainHandler = new DomainHandler();
      const data = await domainHandler.handle({ name });
      if (data) {
        const result = Result.ok(data.getValue());
        res.status(200).json(result);
      } else {
        res.status(400).json(Result.fail("Unable to create domain", 400));
      }
    } catch (error) {
      generateErrorResponse(error, res, next);
      next(error);
    }
  }
}
