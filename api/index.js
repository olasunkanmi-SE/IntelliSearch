const express = require("express");
const { Client } = require("pg");
const { dbConfig } = require("../dbConfig");

const app = express();

const client = new Client(dbConfig);
client
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
