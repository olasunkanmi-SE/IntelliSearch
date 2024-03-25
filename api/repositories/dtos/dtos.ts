import { DocumentTypeEnum, DomainEnum } from "../../lib/constants";

export interface ICreateDocumentDTO {
  title: string;
}

export interface ICreateEmbeddingDTO {
  context: string;
  textEmbedding: number[];
  documentId: number;
  domainId: number;
  documentTypeId: number;
}

export interface ICreateEmbeddingRequestDTO {
  title: string;
  documentType: DocumentTypeEnum;
  domain: DomainEnum;
}

export interface ICreateDomainRequestDTO {
  name: DomainEnum;
}

export interface ICreateDocumentTypeRequestDTO {
  name: DocumentTypeEnum;
}

export interface IChatRequestDTO {
  question: string;
  metaData?: {
    documentId: number;
    pageNumber: number;
  };
  chatHistory?: IHistory[];
}

export interface IHistory {
  role?: string;
  parts?: { text?: string }[];
}

export interface IChatResponseDTO {
  question: string;
  answer: string;
  chatHistory: string;
}
