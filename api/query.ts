export const dbQuery = {
  CREATE_VECTOR: "CREATE EXTENSION IF NOT EXISTS vector;",
  CREATE_DOCUMENT_TABLE: `
    CREATE TABLE IF NOT EXISTS documents (
      id bigserial PRIMARY KEY,
      content text,
      embedding vector(1536)
    );
  `,
  CREATE_MATCH_DOCUMENTS_TABLES: `
    create or replace function match_documents (
      query_embedding vector(1536),
      match_threshold float,
      match_count int
    )
    returns table (
      id bigint,
      content text,
      similarity float
    )
    language sql stable
    as $$
      select
        documents.id,
        documents.content,
        1 - (documents.embedding <=> query_embedding) as similarity
      from documents
      where documents.embedding <=> query_embedding < 1 - match_threshold
      order by documents.embedding <=> query_embedding
      limit match_count;
    $$;
  `,
  CREATE_INDEX: `CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
          WITH (lists = 100);`,
  INSERT_INTO_DOCUMENT_TABLE: (content: string, embedding: any) => `
      INSERT INTO documents (${content}, ${embedding})
      VALUES ($1, $2)
      RETURNING id;
    `,
};
