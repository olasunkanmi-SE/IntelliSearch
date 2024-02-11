import { GoogleGenerativeAI } from "@google/generative-ai";
import { IEmbeddingService } from "../interfaces/embedding-service.interface";

export class EmbeddingService implements IEmbeddingService {
  genAI: GoogleGenerativeAI;
  constructor(protected readonly apiKey: string, protected readonly AIModel: string) {
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }
  /**
   * Generates embeddings for the given text using the generative model.
   * @returns The embedding generated for the text.
   */
  async generateEmbeddings(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({ model: this.AIModel });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return embedding.values;
  }

  /**
   * Calculates the cosine similarity between two vectors.
   * @param vecA - The first vector.
   * @param vecB - The second vector.
   * @returns The cosine similarity between the two vectors.
   * @throws Error if the lengths of the vectors are not equal.
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    if (vecA.length !== vecB.length) {
      throw Error("Both vectors must be of the same length");
    }
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      magnitudeA += Math.pow(vecA[i], 2);
      magnitudeB += Math.pow(vecB[i], 2);
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA !== 0 && magnitudeB !== 0) {
      return dotProduct / (magnitudeA * magnitudeB);
    } else {
      return null;
    }
  }
}
