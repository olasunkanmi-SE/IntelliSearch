import * as express from "express";
import { ChatHandler } from "../handlers/chat.handler";
import { chatHistorySchema, chatRequestSchema } from "../lib/validation-schemas";
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
      const { question, chatHistory, documentId } = chatRequestSchema.parse(req.body);
      const chatHandler = new ChatHandler();
      const history = chatHistory ? chatHistorySchema.parse(JSON.parse(chatHistory)) : [];
      const data = await chatHandler.handle({ question, chatHistory: history, documentId });
      if (data) {
        const result = Result.ok(data.getValue());
        res.status(200).json(result);
      } else {
        res.status(400).json(Result.fail("Unable to generate model response", 400));
      }
    } catch (error) {
      generateErrorResponse(error, res, next);
      next(error);
    }
  }
}
