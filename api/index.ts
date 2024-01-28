import { AppService } from "./services/app.service";
import { DataBase } from "./database";
import express, { Express } from "express";
import "dotenv/config";
import { getEnvValue } from "./utils";
const app: Express = express();

const database: DataBase = new DataBase();
database
  .connect()
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

const filePath: string = getEnvValue("PDF_ABSOLUTE_PATH");
const apiKey: string = getEnvValue("API_KEY");

const createEmbedding = async () => {
  const appService = new AppService(apiKey, filePath);
  return await appService.createEmbeddings();
};

createEmbedding();

const port: number = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
