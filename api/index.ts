import { DataBase } from "./database";
import express, { Express } from "express";
import "dotenv/config";

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

const port: number = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
