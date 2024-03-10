import { DomainRepository } from "./../repositories/domain.repository";
import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { ICreateDomainRequestDTO } from "../repositories/dtos/dtos";
import { IDomainModel } from "../repositories/model";

export class DomainHandler
  implements
    IRequestHandler<ICreateDomainRequestDTO, Result<IDomainModel | undefined>>
{
  async handle(
    request: ICreateDomainRequestDTO,
  ): Promise<Result<IDomainModel | undefined>> {
    try {
      let response: IDomainModel | undefined;
      const { name } = request;
      const domainRepository: DomainRepository = new DomainRepository();
      response = await domainRepository.create(name);
      return response ? Result.ok(response) : undefined;
    } catch (error) {
      console.error(error);
    }
  }
}
