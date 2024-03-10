import { HttpException } from "../exceptions/exception";
import { DomainEnum, HTTP_RESPONSE_CODE } from "../lib/constants";
import { DomainRepository } from "../repositories/domain.repository";
import { IDomainModel } from "../repositories/model";

export class DomainService {
  /**
   * Retrieves the domain model based on the provided domain enum.
   *
   * @param {DomainRepository} domainRepository - The repository for domains.
   * @param {DomainEnum} domain - The domain enum to search for.
   * @returns {Promise<IDomainModel>} - A promise that resolves to the domain model.
   * @throws {Error} - If the domain doesn't exist.
   */
  async getDomain(domain: DomainEnum): Promise<IDomainModel> {
    try {
      let docDomain: IDomainModel | undefined;
      const domainRepository: DomainRepository = new DomainRepository();
      if (Object.values(DomainEnum).includes(domain)) {
        docDomain = await domainRepository.findOne(domain);
      }
      if (!docDomain) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          "Domain doesn't exist",
        );
      }
      return docDomain;
    } catch (error) {
      console.error(error);
    }
  }
}
