export interface IDocumentModel extends IAudit {
  id: number;
  title: string;
}

export interface IEmbeddingModel extends IAudit {
  id: number;
  vector: string;
  documentId: number;
}

export interface IAudit {
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
