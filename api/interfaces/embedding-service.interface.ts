import { TaskType } from "@google/generative-ai";

export interface IEmbeddingService {
  generateEmbeddings(taskType: TaskType, role?: string): Promise<number[]>;
  cosineSimilarity(vecA: number[], vecB: number[]): number;
  euclideanDistance(vecA: number[], vecB: number[]): number;
}
