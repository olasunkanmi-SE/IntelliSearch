import express from "express";
import { DataBase } from "./database";

const app = express();

const database = new DataBase();
database
  .connect()
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server listening on port 3000.");
});
