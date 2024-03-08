import { DomainRepository } from "./../repositories/domain.repository";
import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { ICreateDomainRequestDTO } from "../repositories/dtos/dtos";
import { IDomainModel } from "../repositories/model";

export class DomainHandler implements IRequestHandler<ICreateDomainRequestDTO, Result<IDomainModel>> {
  async handle(request: ICreateDomainRequestDTO): Promise<Result<IDomainModel>> {
    const { name } = request;
    const domainRepository: DomainRepository = new DomainRepository();
    const domain = await domainRepository.create(name);
    return Result.ok(domain);
  }
}
