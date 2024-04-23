export interface IDocumentService {
  convertPDFToText(file: Buffer): Promise<string>;
  writeToFile(outputFilePath: string, text: string): void;
  breakTextIntoChunks(text: string, partSize: number): string[];
  adjustChunkToEndAtCharacter(chunk: string): string;
  formatText(text: string): string;
}
