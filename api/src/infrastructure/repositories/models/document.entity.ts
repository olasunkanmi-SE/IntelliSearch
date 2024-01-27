import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../../reference_model.ts/base_model';

export class DocumentDataModel extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ type: 'varchar', length: 'Max' })
  content: string;

  @Column({ type: 'varchar', length: 'Max' })
  embedding: string;
}
