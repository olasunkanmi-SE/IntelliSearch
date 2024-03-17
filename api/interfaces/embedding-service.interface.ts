import { TaskType } from "@google/generative-ai";
import { DocumentTypeEnum, DomainEnum } from "../lib/constants";
import { Result } from "../lib/result";

export interface IEmbeddingService {
  generateEmbeddings(taskType: TaskType, role?: string): Promise<number[]>;
  cosineSimilarity(vecA: number[], vecB: number[]): number;
  euclideanDistance(vecA: number[], vecB: number[]): number;
  createDocumentsEmbeddings(
    title: string,
    documentType: DocumentTypeEnum,
    domain: DomainEnum
  ): Promise<Result<boolean>>;
}
