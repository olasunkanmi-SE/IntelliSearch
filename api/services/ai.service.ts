import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

export class GenerativeAIService {
  private config: {
    stopSequences: ["red"];
    maxOutputTokens: 200;
    temperature: 0.9;
    topP: 0.1;
    topK: 16;
  };
  protected generativeAi: GoogleGenerativeAI;
  constructor(private apiKey: string, private AIModel: string) {
    this.generativeAi = new GoogleGenerativeAI(this.apiKey);
  }

  generativeModel(): GenerativeModel {
    const model = this.generativeAi.getGenerativeModel({
      model: this.AIModel,
      generationConfig: this.config,
    });
    return model;
  }
}
