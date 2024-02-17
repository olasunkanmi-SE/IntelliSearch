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

  breakTextIntoChunks(text: string, partSize: number): string[] {
    const chunks: string[] = [];
    let startIndex = 0;
    while (startIndex < text.length) {
      let chunk = text.substring(startIndex, partSize);
      const chunkSize = startIndex + partSize;
      //Check if a chunk ends in the middle of a word
      if (chunkSize < text.length && !/\s[---]/.test(text[chunkSize - 1])) {
        //Find the last natural break within the chunk
        const lastSpaceIndex = chunk.lastIndexOf("");
        const lastDashIndex = Math.max(chunk.lastIndexOf("-"), chunk.lastIndexOf("–"), chunk.lastIndexOf("—"));
        const breakIndex = Math.max(lastSpaceIndex, lastDashIndex);
        if (breakIndex !== -1) {
          //Recreate the chunck based on the next break
          chunk = chunk.substring(0, breakIndex + 1);
        }
      }
      chunks.push(chunk);
      startIndex += chunk.length;
    }
    return chunks;
  }
}
