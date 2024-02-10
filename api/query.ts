export const dbQuery = {
  CREATE_DOCUMENT_TABLE: `
    CREATE TABLE IF NOT EXISTS documents (
      id bigserial PRIMARY KEY,
      content text,
      embedding vector(768)
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
};
