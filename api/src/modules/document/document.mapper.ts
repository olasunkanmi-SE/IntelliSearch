import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/infrastructure/repositories/interfaces/mapper.interface';
import { DocumentDataModel } from 'src/infrastructure/repositories/models/document.entity';
import { Document } from './document';

@Injectable()
export class CategoryMapper implements IMapper<Document, DocumentDataModel> {
  toPersistence(entity: Document): DocumentDataModel {
    const { id, content, embedding, audit } = entity;
    const {
      auditCreatedBy,
      auditCreatedDateTime,
      auditModifiedBy,
      auditModifiedDateTime,
      auditDeletedDateTime,
      auditDeletedBy,
    } = audit;
    return {
      _id: id,
      content,
      embedding,
      auditCreatedBy,
      auditCreatedDateTime,
      auditModifiedBy,
      auditModifiedDateTime,
      auditDeletedDateTime,
      auditDeletedBy,
    };
  }

  toDomain(model: DocumentDataModel): Document {
    const { _id, content, embedding } = model;
    const entity: Document = Document.create(
      { content, embedding, audit: new AuditMapper().toDomain(model) },
      _id,
    ).getValue();
    return entity;
  }
}
