export const dbQuery = {
  CREATE_VECTOR: "CREATE EXTENSION IF NOT EXISTS vector;",
  CREATE_TABLE: `
      CREATE TABLE IF NOT EXISTS documents (
        id bigserial PRIMARY KEY,
        content text,
        embedding vector(1536)
      );
    `,
};
