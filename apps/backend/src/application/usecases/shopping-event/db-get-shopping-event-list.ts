import { inject, injectable } from 'tsyringe';
import type { GetShoppingEventListRepository } from '../../contracts';
import {
  type Either,
  type GetShoppingEventList,
  type GetShoppingEventListErrors,
  type GetShoppingEventListParams,
  type GetShoppingEventListResult,
  left,
  right,
  UnexpectedError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

const { infra } = injection;
@injectable()
export class DbGetShoppingEventList implements GetShoppingEventList {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly repository: GetShoppingEventListRepository,
  ) {}

  execute = async ({
    familyId,
    status,
    period,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetShoppingEventListParams): Promise<
    Either<GetShoppingEventListErrors, GetShoppingEventListResult>
  > => {
    try {
      // Get the ShoppingEvent List count based on the filters
      const shoppingEventListCount = await this.repository.count({
        familyId,
        status,
        period,
      });

      // Create the return object with the count and an empty array
      const response: GetShoppingEventListResult = {
        total: shoppingEventListCount,
        shoppingEvents: [],
      };

      // IF count is greater than 0 fetch the actual list based on the same filter
      if (shoppingEventListCount > 0) {
        const shoppingEventList = await this.repository.getAll({
          familyId,
          status,
          period,
          pageIndex,
          pageSize,
          orderBy,
          orderDirection,
        });

        // Assign the returned list in the shoppingList array inside the return object
        response.shoppingEvents = shoppingEventList;
      }

      // Return the object
      return right(response);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  };
}
