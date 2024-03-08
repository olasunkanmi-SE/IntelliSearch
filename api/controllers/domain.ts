import * as express from "express";
import { IDomainModel } from "../repositories/model";
import { Result } from "../lib/result";
import { DomainHandler } from "../handlers/domain.handler";
import { domainRequestSchema } from "../lib/validation-schemas";
export class DomainController {
  path = "/domain";
  router = express.Router();
  constructor() {}

  initRoutes() {
    this.router.post(`${this.path}/create`, this.createDomain);
  }

  async createDomain(req: express.Request, res: any, next: express.NextFunction): Promise<Result<IDomainModel>> {
    try {
      const { name } = domainRequestSchema.parse(req.body);
      const domainHandler = new DomainHandler();
      const response = await domainHandler.handle({ name });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
