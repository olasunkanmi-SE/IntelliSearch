export interface IAppService {
  createContentEmbeddings(): Promise<{ text: string; embeddings?: number[] }[]>;
}
