export interface ICreateEmbedding {
  documentEmbeddings: IDocumentEmbedding[];
  documentId: number;
  documentTypeId: number;
  domainId: number;
}

export interface IDocumentEmbedding {
  text: string;
  embeddings?: number[];
}

export interface IQueryMatch {
  context: string;
  similarity: number;
  textEmbedding: number[];
}
