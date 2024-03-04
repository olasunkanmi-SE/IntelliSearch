import { TaskType } from "@google/generative-ai";
import { IEmbeddingService } from "../interfaces/embedding-service.interface";
import { GenerativeAIService } from "./ai.service";

/**The `role` parameter in the `ContentPart` object is used to specify the role of the text content in relation to the task being performed.
 * the following roles are commonly used:

* **""** (empty string): Typically used for text that is not assigned a specific role or is the primary content being analyzed.
* **"query"**: Used for text that represents a user query or search request.
* **"context"**: Used for text that provides additional context or background information for the query.
* **"response"**: Used for text that is considered a response or answer to the query.


The `taskType` parameter in the `embedContent` method specifies the type of task 
that the language model is being used for when embedding the text content. 
Different task types require different strategies and optimizations in the 
embedding process.

For a retrieval task, which is specified by setting `taskType` to `TaskType.RETRIEVAL_QUERY`, 
the language model is expected to produce vector embeddings that are suitable for retrieving relevant documents 
or passages from a knowledge base or document collection.
The model aims to capture the semantic meaning of the query text 
and represent it in a way that facilitates efficient search and retrieval operations.

**Other Possible Values for `taskType`:**

In addition to `TaskType.RETRIEVAL_QUERY`, other possible values for `taskType` include:

* **TaskType.TEXT_CLASSIFICATION**: Used when the language model is being used for text classification tasks, such as sentiment analysis, topic classification, or language identification.
* **TaskType.QUESTION_ANSWERING**: Used when the language model is being used for question answering tasks, where the goal is to generate a natural language response to a given question.
* **TaskType.DIALOGUE_GENERATION**: Used when the language model is being used for dialogue generation tasks, where the goal is to generate natural language responses in a conversational context 
* When using a generative language model for retrieval tasks, it is important to use the appropriate task type to ensure optimal performance. The `RETRIEVAL_DOCUMENT` task type provides the following optimizations:

* **Semantic Embeddings**: The model focuses on generating vector embeddings that capture the semantic meaning of the document, rather than just its surface features or statistical properties.
* **Relevance Scoring**: The embeddings are optimized to allow for efficient computation of relevance scores between the query and the documents. This enables fast and accurate retrieval of relevant information.
* **Contextual Understanding**: The model takes into account the context in which the document appears, which can help in disambiguating ambiguous or polysemous terms.

**Example Use Case:**

A typical use case for the `RETRIEVAL_DOCUMENT` task type is embedding documents in a knowledge base to enable efficient search and retrieval 
of information. For example, you could use this task type to embed articles, FAQs, 
or product manuals to create a searchable knowledge base for customer support or information retrieval systems.*/

export class EmbeddingService
  extends GenerativeAIService
  implements IEmbeddingService
{
  constructor(apiKey: string, AIModel: string) {
    super(apiKey, AIModel);
  }
  /**
   * Generates embeddings for the given text using the generative model.
   * @returns The embedding generated for the text.
   */
  async generateEmbeddings(
    text: string,
    taskType: TaskType,
    role?: string
  ): Promise<number[]> {
    if (!Object.values(TaskType).includes(taskType)) {
      throw new Error("Please provide a valid task type");
    }
    const aiModel = this.generativeModel();
    const result = await aiModel.embedContent({
      content: { parts: [{ text }], role: role || "" },
      taskType,
    });
    const embedding = result.embedding;
    return embedding.values;
  }

  /**
   * Calculates the cosine similarity between two vectors.
   * @param vecA - The first vector.
   * @param vecB - The second vector.
   * @returns The cosine similarity between the two vectors.
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    let consineDistance = 0;
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
      consineDistance = dotProduct / (magnitudeA * magnitudeB);
    }
    return consineDistance;
  }

  /**
   * Calculates the euclidean distance between two vectors.
   * @param vecA - The first vector.
   * @param vecB - The second vector.
   * @returns The cosine similarity between the two vectors.
   * @throws Error if the lengths of the vectors are not equal.
   */
  euclideanDistance(vecA: number[], vecB: number[]): number {
    let sum = 0;
    for (let n = 0; n < vecA.length; n++) {
      sum += Math.pow(vecA[n] - vecB[n], 2);
    }
    return Math.sqrt(sum);
  }
}
