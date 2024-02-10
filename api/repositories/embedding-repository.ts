import { database } from "..";

export class EmbeddingRepository {
  insertDocument = async (content: string, embedding: string) => {
    try {
      const result = await database.client.query(
        `INSERT INTO documents (content, embedding)
        VALUES ($1, $2)`,
        [JSON.stringify(content), embedding]
      );
      if (!result) {
        throw new Error("Unable to insert embeddings into the DB");
      }
      return result;
    } catch (error) {
      console.error("Error inserting document into DB", error);
    }
  };

  createDocumentTable = async () => {
    try {
      const result = await database.client.query(
        `
    CREATE TABLE IF NOT EXISTS documents (
      id bigserial PRIMARY KEY,
      content text,
      embedding vector(768)
    );
  `
      );
      if (!result) {
        throw new Error("Unable to create the document table");
      }
      return result;
    } catch (error) {
      console.error("Unable to create the document table", error);
    }
  };

  createVectorExtension = async () => {
    try {
      const result = await database.client.query(`CREATE EXTENSION IF NOT EXISTS vector`);
      if (!result) {
        throw new Error("Error creating vector extension");
      }
    } catch (error) {
      console.error("Error creating vector extension", error);
    }
  };
}
