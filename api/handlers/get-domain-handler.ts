import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { DomainRepository } from "../repositories/domain.repository";
import { IDomainModel } from "../repositories/model";

export class GetDomainHandler implements IRequestHandler<{}, Result<IDomainModel[]>> {
  async handle(): Promise<Result<IDomainModel[]>> {
    let response: IDomainModel[];
    const domainRepository: DomainRepository = new DomainRepository();
    response = await domainRepository.getDocumentDomain();
    return Result.ok(response);
  }
}
