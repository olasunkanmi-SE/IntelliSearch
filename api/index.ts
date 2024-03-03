import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import express, { Express } from "express";
import { getValue } from "./utils";
import { AppService } from "./services/app.service";
import { CONSTANTS } from "./core/constants";
const app: Express = express();

const prisma = new PrismaClient();

app.get(`/post`, async (req, res) => {
  const result = await prisma.document.count();
  return res.json(result);
});

const filePath: string = getValue("PDF_ABSOLUTE_PATH");
const apiKey: string = getValue("API_KEY");

// const createEmbedding = async () => {
//   const appService = new AppService(apiKey, filePath, CONSTANTS.AIModels.embedding);
//   return await appService.createContentEmbeddings();
// };

// createEmbedding();

// const chat = new Chat(apiKey, CONSTANTS.AIModels.chat);
// chat.run();

// const repo = new GenericSQLRepository().createProductsAndReviews();
const port: number = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
