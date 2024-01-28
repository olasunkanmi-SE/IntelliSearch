export interface IDocumentService {
  convertPDFToText(pdfFilePath: string): Promise<string>;
  writeToFile(outputFilePath: string, text: string): void;
}
