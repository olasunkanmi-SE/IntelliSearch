import { Column, CreateDateColumn } from 'typeorm';

export abstract class BaseModel {
  @CreateDateColumn({ type: 'varchar' })
  auditCreatedDateTime: string;

  @Column({ type: 'varchar', nullable: true })
  auditModifiedDateTime?: string;

  @Column({ type: 'varchar', length: 126 })
  auditCreatedBy: string;

  @Column({ type: 'varchar', length: 126, nullable: true })
  auditModifiedBy?: string;

  @Column({ type: 'varchar', nullable: true })
  auditDeletedDateTime?: string;

  @Column({ type: 'varchar', length: 126, nullable: true })
  auditDeletedBy?: string;
}
