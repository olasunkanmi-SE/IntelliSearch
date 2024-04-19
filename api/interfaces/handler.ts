// Todo, refactor IRequestHandler< TResponse, TRequest = any> so as to make TRequest optional type
export interface IRequestHandler<TRequest, TResponse> {
  handle(request?: TRequest): Promise<TResponse>;
}
