import {
  EnhancedGenerateContentResponse,
  GenerateContentResult,
  GenerativeModel,
  TaskType,
} from "@google/generative-ai";
import { HttpException } from "../exceptions/exception";
import { IDocumentService } from "../interfaces/document-service.interface";
import { IEmbeddingService } from "../interfaces/embedding-service.interface";
import { ICreateEmbedding, IQueryMatch } from "../interfaces/generic-interface";
import { AiModels, DocumentTypeEnum, DomainEnum, HTTP_RESPONSE_CODE } from "../lib/constants";
import { Result } from "../lib/result";
import { DocumentRepository } from "../repositories/document.repository";
import { IDocumentModel, IDocumentTypeModel, IDomainModel } from "../repositories/model";
import { getValue } from "../utils";
import { EmbeddingRepository } from "./../repositories/embedding.repository";
import { GenerativeAIService } from "./generative-ai-service";
import { DocumentTypeService } from "./document-type.service";
import { DocumentService } from "./document.service";
import { DomainService } from "./domain.service";
import { oneLine } from "common-tags";

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

export class EmbeddingService extends GenerativeAIService implements IEmbeddingService {
  documentPath: string = getValue("PDF_ABSOLUTE_PATH");
  constructor(apiKey: string) {
    super(apiKey);
  }
  /**
   * Generates embeddings for the given text using the generative model.
   * @returns The embedding generated for the text.
   */
  async generateEmbeddings(
    text: string,
    taskType: TaskType,
    role?: string
  ): Promise<{
    embedding: number[];
    text: string;
  }> {
    try {
      if (!Object.values(TaskType).includes(taskType)) {
        throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Please provide a valid task type");
      }
      const model = AiModels.embedding;
      const aiModel = this.generativeModel(model);
      const result = await aiModel.embedContent({
        content: { parts: [{ text }], role: role || "" },
        taskType,
      });
      const embedding = result.embedding;
      const data = {
        embedding: embedding.values,
        text,
      };
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  /*  Computes the cosine similarity between two vectors of equal length.
   *   Cosine similarity is a measure of the similarity between two vectors, and is calculated by finding the dot product
   *  of the two vectors divided by the product of their magnitudes.
   *  @param vecA - The first vector * @param vecB - The second vector
   *  @throws {Error} if the vectors are not of equal length
   *  @returns {number} - A number between -1 and 1 representing the cosine similarity of the two vectors
   *
   * */
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

  /**
   * Creates a new document and generates embeddings for its content.
   *
   * @param {string} title - The title of the document.
   * @param {DocumentTypeEnum} documentType - The type of the document.
   * @param {DomainEnum} domain - The domain of the document.
   * @returns {Promise<boolean>} - A promise that resolves to true if the document and embeddings are created successfully, false otherwise.
   * @throws {Error} - If the document type or domain doesn't exist, or if unable to create document embeddings.
   */
  async createDocumentsEmbeddings(
    title: string,
    documentType: DocumentTypeEnum,
    domain: DomainEnum
  ): Promise<Result<boolean>> {
    try {
      const documentRepository: DocumentRepository = new DocumentRepository();
      const domainService: DomainService = new DomainService();
      const documentTypeService: DocumentTypeService = new DocumentTypeService();
      const docType: IDocumentTypeModel | undefined = await documentTypeService.getDocumentType(documentType);
      const documentTypeId: number = docType.id;

      const docDomain: IDomainModel | undefined = await domainService.getDomain(domain);
      const domainId: number = docDomain.id;
      const document: IDocumentModel = await documentRepository.create(title);
      let documentId: number;

      if (document) {
        documentId = document.id;
        const documentEmbeddings: { text: string; embeddings?: number[] }[] = await this.createContentEmbeddings();
        if (!documentEmbeddings?.length) {
          throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Unable to create embedding");
        }
        const data: ICreateEmbedding = {
          documentEmbeddings,
          documentId,
          documentTypeId,
          domainId,
        };
        const embeddingRepository: EmbeddingRepository = new EmbeddingRepository();
        const response = await embeddingRepository.createDocumentEmbeddings(data);
        const result = response.getValue();
        return Result.ok(result);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async createContentEmbeddings(): Promise<{ text: string; embeddings?: number[] }[]> {
    const documentService: IDocumentService = new DocumentService();
    let text: string;
    if (!this.documentPath.length) {
      throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Could not read PDF file");
    }
    text = await documentService.convertPDFToText(this.documentPath);
    const chunks: string[] = documentService.breakTextIntoChunks(text, 2000);

    const contentEmbed = chunks.map(
      async (chunk) => await this.generateEmbeddings(chunk, TaskType.RETRIEVAL_DOCUMENT, "context")
    );

    const textEmbeddings: {
      embedding: number[];
      text: string;
    }[] = await Promise.all(contentEmbed);

    return textEmbeddings;
  }

  /**
   * Generates 2 similar queries and appends the original query to the generated queries.
   * @param query - The original query
   * @returns A promise that resolves to a string of the generated queries
   *  */
  async generateSimilarQueries(query: string): Promise<string> {
    const model = AiModels.gemini;
    const aiModel: GenerativeModel = this.generativeModel(model);
    const prompt = oneLine`
    when asked a compound question that contains multiple parts, 
    I want you to break it down into separate sub-queries that can be answered individually, 
    the query should be broken down to at most 2 parts, return comma seperated queries.
    However if the question is a single question, straight forward query without multiple parts, 
    Generate 1 additional comma seperated queries that are similar to this query and append the original query too: ${query}
    `;
    const result: GenerateContentResult = await aiModel.generateContent(prompt);
    const response: EnhancedGenerateContentResponse = result.response;
    const text: string = response.text();
    console.log(text);
    return text;
  }

  /**
   * Generates query embeddings for retrieval task
   * Generates similar queries and then generates embeddings for each query
   * @param query - The query to generate embeddings for
   * @returns A Promise that resolves to a 2D array of embeddings
   * @throws {HttpException} if unable to generate similar queries
   **/
  async generateUserQueryEmbeddings(query: string): Promise<number[][]> {
    const queries = await this.generateSimilarQueries(query);
    if (!queries?.length) {
      throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Unable to generate similar queries");
    }
    const queriesArray = queries.split("\n");
    const embeddingPromise = queriesArray.map((query) => {
      return this.generateEmbeddings(query, TaskType.RETRIEVAL_QUERY, "query");
    });
    const embeddings = await Promise.all(embeddingPromise);
    return embeddings.map((e) => e.embedding);
  }

  /**
   * Generates query matches for the given user query, match count, and similarity threshold.
   * 1. Generate embeddings for the user query.
   * 2. Match documents to the query embeddings.
   * 3. Flattens the resulting matches.
   * @param query - The user query to match against.
   * @param matchCount - The number of matches to return per embedding.
   * @param similarityThreshold - The minimum similarity score to consider a match.
   * @returns An array of query matches.
   * @throws {HttpException} if query embeddings could not be generated.
   **/
  async getQueryMatches(query: string, matchCount: number, similarityThreshold: number): Promise<IQueryMatch[]> {
    const queryEmbeddings = await this.generateUserQueryEmbeddings(query);
    if (!queryEmbeddings?.length) {
      throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Unable to generate user query embeddings");
    }
    const embeddingRepository: EmbeddingRepository = new EmbeddingRepository();
    const embeddings = queryEmbeddings.map((embedding) =>
      //passing in the documentId here.
      embeddingRepository.matchDocuments(embedding, matchCount, similarityThreshold)
    );
    const matches = await Promise.all(embeddings);
    return matches.flat();
  }
}
