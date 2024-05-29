import { TaskType } from "@google/generative-ai";
import { DocumentTypeEnum, DomainEnum } from "../lib/constants";
import { Result } from "../lib/result";
import { IQueryMatch } from "./generic-interface";

export interface IEmbeddingService {
  generateEmbeddings(
    taskType: TaskType,
    role?: string
  ): Promise<{
    embedding: number[];
    text: string;
  }>;
  cosineSimilarity(vecA: number[], vecB: number[]): number;
  euclideanDistance(vecA: number[], vecB: number[]): number;
  createDocumentsEmbeddings(title: string, documentType: number, domain: number): Promise<Result<boolean>>;
  getQueryMatches(
    query: string,
    matchCount: number,
    similarityThreshold: number,
    documentId: number
  ): Promise<IQueryMatch[]>;
}
