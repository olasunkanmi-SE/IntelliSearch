import {
  GenerationConfig,
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { modelConfig } from "../lib/constants";

export class GenerativeAIService {
  private config: GenerationConfig = modelConfig;
  protected generativeAi: GoogleGenerativeAI;
  constructor(private apiKey: string) {
    this.generativeAi = new GoogleGenerativeAI(this.apiKey);
  }

  generativeModel(aiModel: string): GenerativeModel {
    const model = this.generativeAi.getGenerativeModel({
      model: aiModel,
      generationConfig: this.config,
    });
    return model;
  }
}
