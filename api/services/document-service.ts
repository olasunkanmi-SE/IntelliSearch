import fs from "fs";
import pdf from "pdf-parse";
import { Utility } from "../utils/utils";
import { IDocumentService } from "../interfaces/document-service.interface";

export class DocumentService implements IDocumentService {
  async convertPDFToText(pdfFilePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(pdfFilePath);
      const data = await pdf(dataBuffer);
      const text = data.text;
      const formatedText = Utility.formatText(text);
      return formatedText;
    } catch (error) {
      console.error("Error while converting pdf to text", error);
    }
  }

  writeToFile(outputFilePath: string, text: string): void {
    fs.writeFile(outputFilePath, text, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File written successfully!");
      }
    });
  }
}
