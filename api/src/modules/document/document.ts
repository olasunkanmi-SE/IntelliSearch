import { Result } from 'src/domain/result';
import { IDocumentProps } from './document.interface';

export class Document {
  constructor(
    id: number,
    private readonly props: IDocumentProps,
  ) {}

  get id() {
    return this.props.id;
  }

  get content() {
    return this.props.content;
  }

  get embedding() {
    return this.props.embedding;
  }

  get audit() {
    return this.props.audit;
  }

  static create(props: IDocumentProps, id?: number) {
    return Result.ok(new Document(id, props)).getValue();
  }
}
