// // Define the API routes.
// app.get("/embed", async (req, res) => {
//   // Get the document from the request body.
//   const document = req.body.document;

//   // Embed the document using the Gemini API.
//   const result = await geminiClient.embed([document]);

//   // Store the embedded document in the PostgreSQL database.
//   const query = `INSERT INTO documents (vector) VALUES ($1)`;
//   const values = [result.embeddings[0]];
//   client
//     .query(query, values)
//     .then(() => {
//       console.log("Embedded document stored in the PostgreSQL database.");
//     })
//     .catch((err) => {
//       console.error("Error storing embedded document in the PostgreSQL database:", err);
//     });

//   // Send the response to the client.
//   res.json(result);
// });
