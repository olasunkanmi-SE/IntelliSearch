import { Audit } from 'src/domain/audit';

export interface IDocumentProps {
  id: number;
  content: string;
  embedding: string;
  audit: Audit;
}
