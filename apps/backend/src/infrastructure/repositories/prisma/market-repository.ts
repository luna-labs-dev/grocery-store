import { MarketMapper } from './mappers/market-mapper';
import type {
  CountMarketListRepositoryParams,
  GetMarketByCodeRepositoryParams,
  GetMarketByIdRepositoryParams,
  GetMarketListRepositoryParams,
  MarketRepositories,
} from '@/application';
import type { Market } from '@/domain';
import { prisma } from '@/main/prisma/client';

export class PrismaMarketRepository implements MarketRepositories {
  count = async ({
    search,
  }: CountMarketListRepositoryParams): Promise<number> => {
    const count = await prisma.market.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return count;
  };

  getAll = async ({
    search,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetMarketListRepositoryParams): Promise<Market[]> => {
    const markets = await prisma.market.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy: {
        [orderBy]: orderDirection,
      },
    });

    if (markets.length === 0) {
      return [];
    }

    return markets.map((market) => MarketMapper.toDomain(market));
  };

  getById = async ({
    id,
  }: GetMarketByIdRepositoryParams): Promise<Market | undefined> => {
    const market = await prisma.market.findFirst({
      where: {
        id,
      },
    });

    if (!market) {
      return;
    }

    return MarketMapper.toDomain(market);
  };

  getByCode = async ({
    code,
  }: GetMarketByCodeRepositoryParams): Promise<Market | undefined> => {
    const market = await prisma.market.findFirst({
      where: {
        code,
      },
    });

    if (!market) {
      return;
    }

    return MarketMapper.toDomain(market);
  };

  add = async (market: Market): Promise<void> => {
    await prisma.market.create({
      data: MarketMapper.toPersistence(market),
    });
  };

  update = async (market: Market): Promise<void> => {
    await prisma.market.update({
      where: {
        id: market.id,
      },
      data: MarketMapper.toPersistence(market),
    });
  };
}
