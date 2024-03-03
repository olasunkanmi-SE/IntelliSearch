export interface IAppService {
  createContentEmbeddings(): Promise<number[][]>;
}
