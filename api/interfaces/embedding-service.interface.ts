export interface IEmbeddingService {
  generateEmbeddings(text: string): Promise<number[]>;
  cosineSimilarity(vecA: number[], vecB: number[]): number;
}
