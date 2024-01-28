export class EmbeddingService {
  generateEmbeddings() {}

  /**
   * Calculates the cosine similarity between two vectors.
   * @param vecA - The first vector.
   * @param vecB - The second vector.
   * @returns The cosine similarity between the two vectors.
   * @throws Error if the lengths of the vectors are not equal.
   */
  cosineSimilarity(vecA: number[], vecB: number[]) {
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
