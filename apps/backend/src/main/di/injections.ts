import { container } from 'tsyringe';
import { env } from '../config/env';
import type { FastifyTypedInstance } from '../fastify/types';
import { injection } from './injection-tokens';
import type { FastifyController } from '@/api/contracts/fastify-controller';
import {
  AdminController,
  AuthController,
  CartController,
  GroupController,
  MarketController,
  ShoppingEventController,
} from '@/api/controllers';
import {
  DbCartManager,
  DbGroupManager,
  DbMarketManager,
  DbShoppingEventManager,
  DbUserManager,
  JobProductHydrator,
  RemoteProductHydrator,
} from '@/application';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type { GroupRepositories } from '@/application/contracts/repositories/group';
import type { MarketRepositories } from '@/application/contracts/repositories/market';
import type { OutboxEventRepositories } from '@/application/contracts/repositories/outbox-event-repository';
import type {
  AddCanonicalProductRepository,
  GetCanonicalProductByIdRepository,
  UpdateCanonicalProductRepository,
} from '@/application/contracts/repositories/product-hierarchy';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import type { ProductRepository } from '@/application/contracts/repositories/product-repository';
import type { SettingsRepository } from '@/application/contracts/repositories/settings-repository';
import type { ShoppingEventRepositories } from '@/application/contracts/repositories/shopping-event';
import type { ProductRepositories } from '@/application/contracts/repositories/shopping-event/cart';
import type { UserRepositories } from '@/application/contracts/repositories/user';
import type { IConfigService } from '@/application/contracts/services/config-service';
import type { Places } from '@/application/contracts/services/places';
import type {
  ICartManager,
  IGroupManager,
  IHydrateProductJob,
  IMarketManager,
  IProductHydrator,
  IShoppingEventManager,
  IUserManager,
} from '@/domain';
import type { PermissionService } from '@/domain/core/logic/permissions/permission-service';
import {
  CompositeExternalProductService,
  ConfigService,
  DrizzleCanonicalProductRepository,
  DrizzleExternalFetchLogRepository,
  DrizzleGroupRepository,
  DrizzleMarketRepository,
  DrizzleOutboxEventRepository,
  DrizzleProductIdentityRepository,
  DrizzleProductRepository,
  DrizzleSettingsRepository,
  DrizzleShoppingEventRepository,
  DrizzleUserRepository,
  GooglePlaces,
  GooglePlacesHttpClient,
  OpenFoodFactsService,
  ResilienceService,
  SecurityPermissionService,
  UpcItemDbService,
} from '@/infrastructure';

const { infra, usecases, controllers } = injection;

export const registerInjections = (app: FastifyTypedInstance): void => {
  // Repositories
  container.register<UserRepositories>(
    infra.userRepositories,
    DrizzleUserRepository,
  );
  container.register<MarketRepositories>(
    infra.marketRepositories,
    DrizzleMarketRepository,
  );
  container.register<GroupRepositories>(
    infra.groupRepositories,
    DrizzleGroupRepository,
  );
  container.register<ShoppingEventRepositories>(
    infra.shoppingEventRepositories,
    DrizzleShoppingEventRepository,
  );
  container.register<ProductRepositories>(
    infra.productRepositories,
    DrizzleProductRepository,
  );
  container.register<
    AddCanonicalProductRepository &
      GetCanonicalProductByIdRepository &
      UpdateCanonicalProductRepository
  >(infra.canonicalProductRepositories, DrizzleCanonicalProductRepository);
  container.register<ProductIdentityRepository>(
    infra.productIdentityRepositories,
    DrizzleProductIdentityRepository,
  );
  container.register<OutboxEventRepositories>(
    infra.outboxEventRepositories,
    DrizzleOutboxEventRepository,
  );
  container.register<ProductRepository>(
    infra.externalFetchLogRepository,
    DrizzleExternalFetchLogRepository,
  );

  // Services
  container.register<IHydrateProductJob>(usecases.productHydratorJob, {
    useFactory: (c) =>
      new JobProductHydrator(
        c.resolve(infra.outboxEventRepositories),
        c.resolve(infra.canonicalProductRepositories),
        c.resolve(infra.compositeProductService),
        c.resolve(infra.productIdentityRepositories),
      ),
  });
  container.register(infra.placesHttpClient, {
    useFactory: () =>
      new GooglePlacesHttpClient({
        apiKey: env.googlePlaces.apiKey,
        baseURL: env.googlePlaces.baseURL,
      }),
  });
  container.register<Places>(infra.places, GooglePlaces);
  container.register<IConfigService>(infra.configService, ConfigService);
  container.register<SettingsRepository>(
    infra.settingsRepository,
    DrizzleSettingsRepository,
  );
  container.register<PermissionService>(
    infra.permissionService,
    SecurityPermissionService,
  );
  container.register<ExternalProductClient>(
    infra.openFoodFactsService,
    OpenFoodFactsService,
  );
  container.register<ExternalProductClient>(
    infra.upcItemDbService,
    UpcItemDbService,
  );
  container.register<ExternalProductClient>(
    infra.compositeProductService,
    CompositeExternalProductService,
  );
  container.register(ResilienceService, ResilienceService);

  // Usecases
  container.register<ICartManager>(usecases.cartManager, DbCartManager);
  container.register<IGroupManager>(usecases.groupManager, DbGroupManager);
  container.register<IMarketManager>(usecases.marketManager, DbMarketManager);
  container.register<IShoppingEventManager>(
    usecases.shoppingEventManager,
    DbShoppingEventManager,
  );
  container.register<IUserManager>(usecases.userManager, DbUserManager);
  container.register<IProductHydrator>(
    usecases.productHydrator,
    RemoteProductHydrator,
  );

  // Fastify Instance
  container.registerInstance<FastifyTypedInstance>('FastifyInstance', app);

  // Fastify Controllers
  container.register<FastifyController>(controllers.fastify, AuthController);
  container.register<FastifyController>(controllers.fastify, GroupController);
  container.register<FastifyController>(controllers.fastify, MarketController);
  container.register<FastifyController>(
    controllers.fastify,
    ShoppingEventController,
  );
  container.register<FastifyController>(controllers.fastify, CartController);
  container.register<FastifyController>(controllers.fastify, AdminController);
};
