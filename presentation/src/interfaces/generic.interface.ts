export interface Message {
  text: string;
  metaData?: {
    documentId: number;
    pageNumber: number;
  };
}

export interface Iresponse {
  history: { role: string; parts: { text: string }[] }[];
  question: string;
  answer: string;
}
