export interface ICreateDocumentDTO {
  title: string;
}

export interface ICreateEmbeddingDTO {
  text: string;
  vector: string;
  documentId: number;
}
