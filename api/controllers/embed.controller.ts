import * as express from "express";
import { CreateDocumentEmbeddingHandler } from "../handlers/create-document-embed.handler";
import { documentRequestSchema } from "../lib/validation-schemas";
import { generateErrorResponse } from "../utils/utils";
import { Result } from "../lib/result";
import multer from "multer";
export class EmbeddingController {
  path = "/embed";
  router = express.Router();
  upload = multer({ limits: { fileSize: 5000000 } });
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(`${this.path}/documents`, this.upload.single("pdf"), this.createDocumentEmbeddings);
  }

  async createDocumentEmbeddings(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.file) {
      return res.json(Result.fail("No file uploaded", 400));
    }
    const file = req.file;
    const { buffer } = file;
    const embeddingHandler: CreateDocumentEmbeddingHandler = new CreateDocumentEmbeddingHandler(buffer);
    try {
      const { title, documentType, domain } = documentRequestSchema.parse(req.body);
      const result = await embeddingHandler.handle({
        title,
        documentType,
        domain,
      });
      if (!result?.isSuccess) {
        return res.json(Result.fail("unable to create embeddings", 400));
      }
      return res.json(result);
    } catch (error) {
      generateErrorResponse(error, res, next);
    }
  }
}
