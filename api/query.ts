export const dbQuery = {
  CREATE_VECTOR: "CREATE EXTENSION IF NOT EXISTS vector;",
  CREATE_DOCUMENT_TABLE: `
    CREATE TABLE IF NOT EXISTS documents (
      id bigserial PRIMARY KEY,
      content text,
      embedding vector(1536)
    );
  `,
  SIMILARITY_SEARCH: `
    SELECT
      documents.id,
      documents.content,
      1 - (documents.embedding <=> $1) AS similarity
    FROM documents
    WHERE documents.embedding <=> $1 < 1 - $2
    ORDER BY documents.embedding <=> $1
    LIMIT match_count;
  `,
  CREATE_INDEX: `CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);`,
  INSERT_INTO_DOCUMENT_TABLE: `
    INSERT INTO documents (content, embedding)
    VALUES ($1, $2)
  `,
};
