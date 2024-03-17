export interface IDocumentModel extends IAudit {
  id: number;
  title: string;
}

export interface IEmbeddingModel extends IAudit {
  id?: number;
  context: string;
  textEmbedding: number[];
  documentId: number;
  domainId: number;
  documentTypeId: number;
}

export interface IAudit {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IDocumentTypeModel extends IAudit {
  id?: number;
  name: string;
}

export interface IDomainModel extends IAudit {
  id?: number;
  name: string;
}
