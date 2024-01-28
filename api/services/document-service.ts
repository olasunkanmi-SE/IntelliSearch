import fs from "fs";
import pdf from "pdf-parse";

export class DocumentService {
  async convertPDFToText(pdfFilePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(pdfFilePath);
      const data = await pdf(dataBuffer);
      const text = data.text;
      return text.replace(/\n/g, "");
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
