export const AppError = {
  VectorCreationError: "Error creating pg vector extension",
  CreateDocumentError: (document: string) => `Unable to create document, with query ${document}`,
  dbConnectionError: "Error connecting to the database:",
  dbDisconnectError: "Error disconnecting from the database:",
};
