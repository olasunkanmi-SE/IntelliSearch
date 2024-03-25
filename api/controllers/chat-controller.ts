import * as express from "express";
import { ChatHandler } from "../handlers/chat.handler";
import { chatRequestSchema } from "../lib/validation-schemas";
import { Result } from "../lib/result";
import { generateErrorResponse } from "../utils/utils";
export class ChatController {
  path = "/chat";
  router = express.Router();
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}`, this.chat);
  }

  async chat(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { question } = chatRequestSchema.parse(req.body);
      const chatHandler = new ChatHandler();
      const data = await chatHandler.handle({ question });
      if (data) {
        const result = Result.ok(data.getValue());
        res.status(200).json(result);
      } else {
        res.status(400).json(Result.fail("Unable to create document type", 400));
      }
    } catch (error) {
      generateErrorResponse(error, res, next);
      next(error);
    }
  }
}
