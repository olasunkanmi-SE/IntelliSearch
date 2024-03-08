export interface ICreateDocumentDTO {
  title: string;
}

export interface ICreateEmbeddingDTO {
  text: string;
  textEmbedding: string;
  documentId: number;
  domainId: number;
  documentTypeId: number;
}
