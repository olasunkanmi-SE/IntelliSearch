import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './../../modules/document/document';
import { GenericSqlRepository } from './generic-sql-repository';
import { DocumentDataModel } from './models/document.entity';
import { Repository } from 'typeorm';

export class DocumentSqlRepository extends GenericSqlRepository<
  Document,
  DocumentDataModel
> {
  constructor(
    @InjectRepository(DocumentDataModel)
    private readonly documentSqlRepository: Repository<DocumentDataModel>,
  ) {}
}
