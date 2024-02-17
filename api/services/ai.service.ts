import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

export class GenerativeAIService {
  private config: {
    stopSequences: ["red"];
    maxOutputTokens: 200;
    temperature: 0.9;
    topP: 0.1;
    topK: 16;
  };
  protected genAIModel: GenerativeModel;
  constructor(private apiKey: string, private AIModel: string) {
    this.genAIModel = new GoogleGenerativeAI(this.apiKey).getGenerativeModel({
      model: this.AIModel,
      generationConfig: this.config,
    });
  }
}
