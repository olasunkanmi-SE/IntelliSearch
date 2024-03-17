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
