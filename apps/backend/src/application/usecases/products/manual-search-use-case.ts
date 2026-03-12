import { inject, injectable } from 'tsyringe';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import type { ProductIdentity } from '@/domain/entities/product-identity';
import { injection } from '@/main/di/injection-tokens';

@injectable()
export class ManualSearchUseCase {
  constructor(
    @inject(injection.infra.productIdentityRepositories)
    private productIdentityRepo: ProductIdentityRepository,
  ) {}

  async execute(
    query: string,
    pageIndex = 0,
    pageSize = 10,
  ): Promise<{ items: ProductIdentity[]; total: number }> {
    if (!query || query.trim().length < 2) {
      return { items: [], total: 0 };
    }

    return this.productIdentityRepo.search(
      query,
      pageIndex,
      pageSize,
    ) as Promise<{
      items: ProductIdentity[];
      total: number;
    }>;
  }
}
