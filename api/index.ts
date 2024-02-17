import { AppService } from "./services/app.service";
import { DataBase } from "./database";
import express, { Express } from "express";
import "dotenv/config";
import { getValue } from "./utils";
import { CONSTANTS } from "./core/constants";
import { GenericSQLRepository } from "./repositories/generic-sql-repository";
import { Chat } from "./services/chat.service";
const app: Express = express();

export const database: DataBase = new DataBase();
async function initializeDatabase() {
  try {
    await database.connect();
    console.log("Connected to database.");
    const documentsExists = await database.documentExists();
    if (documentsExists) {
      await database.createEmbeddingIndex();
    } else {
      await database.createVector();
      console.log("Vector created.");

      await database.createDocumentsTable();
    }
    console.log("Documents table created.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

initializeDatabase();

const filePath: string = getValue("PDF_ABSOLUTE_PATH");
const apiKey: string = getValue("API_KEY");

// const createEmbedding = async () => {
//   const appService = new AppService(apiKey, filePath, CONSTANTS.AIModels.embedding);
//   return await appService.createContentEmbeddings();
// };

// createEmbedding();

const chat = new Chat(apiKey, CONSTANTS.AIModels.chat);
chat.run();

// const repo = new GenericSQLRepository().createProductsAndReviews();
const port: number = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
