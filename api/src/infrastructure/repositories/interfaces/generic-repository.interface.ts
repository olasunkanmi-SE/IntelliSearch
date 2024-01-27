import { FindOneOptions } from 'typeorm';

export interface IGenericRepository<TEntity, TModel> {
  save(T: TEntity): Promise<TModel>;
  find(findOneOptions: FindOneOptions<TModel>): Promise<TEntity[]>;
  findOneOrFail(): Promise<TEntity>;
  findOne(findOptions: FindOneOptions): Promise<TEntity | undefined>;
  findAll(): Promise<TEntity[]>;
}
