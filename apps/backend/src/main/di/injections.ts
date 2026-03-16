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
  CartService,
  GroupService,
  HydrateProductUseCase,
  ManualSearchUseCase,
  MarketService,
  ScanProductUseCase,
  ShoppingEventService,
  UserService,
} from '@/application';
import { HydrateProductJob } from '@/application/usecases/products/hydrate-product-job';
import type { ICartService } from '@/domain';
import {
  Buidler,
  CompositeExternalProductClient,
  ConfigService,
  DrizzleCanonicalProductRepository,
  DrizzleExternalFetchLogRepository,
  DrizzleGroupRepository,
  DrizzleMarketRepository,
  DrizzleOutboxEventRepository,
  DrizzlePhysicalEanRepository,
  DrizzleProductIdentityRepository,
  DrizzleProductRepository,
  DrizzleSettingsRepository,
  DrizzleShoppingEventRepository,
  DrizzleUserRepository,
  GooglePlaces,
  GooglePlacesHttpClient,
  OpenFoodFactsClient,
  SecurityPermissionService,
  UpcItemDbClient,
} from '@/infrastructure';

const { infra, usecases, controllers } = injection;

export const registerInjections = (app: FastifyTypedInstance): void => {
  // Repositories
  container.register(infra.userRepositories, DrizzleUserRepository);
  container.register(infra.marketRepositories, DrizzleMarketRepository);
  container.register(infra.groupRepositories, DrizzleGroupRepository);
  container.register(
    infra.shoppingEventRepositories,
    DrizzleShoppingEventRepository,
  );
  container.register(infra.productRepositories, DrizzleProductRepository);
  container.register(
    infra.canonicalProductRepositories,
    DrizzleCanonicalProductRepository,
  );
  container.register(
    infra.productIdentityRepositories,
    DrizzleProductIdentityRepository,
  );
  container.register(
    infra.outboxEventRepositories,
    DrizzleOutboxEventRepository,
  );
  container.register(infra.physicalEanRepository, DrizzlePhysicalEanRepository);
  container.register(
    infra.externalFetchLogRepository,
    DrizzleExternalFetchLogRepository,
  );

  // Services
  container.register(usecases.hydrateProductJob, {
    useFactory: (c) =>
      new HydrateProductJob(
        c.resolve(infra.outboxEventRepositories),
        c.resolve(infra.canonicalProductRepositories),
        c.resolve(infra.compositeProductClient),
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
  container.register(infra.places, GooglePlaces);
  container.register(infra.configService, ConfigService);
  container.register(infra.settingsRepository, DrizzleSettingsRepository);
  container.register(infra.permissionService, SecurityPermissionService);
  container.register(infra.openFoodFactsClient, OpenFoodFactsClient);
  container.register(infra.upcItemDbClient, UpcItemDbClient);
  container.register(
    infra.compositeProductClient,
    CompositeExternalProductClient,
  );
  container.register(Buidler, Buidler);

  // Usecases
  container.register<ICartService>(usecases.cartService, CartService);
  container.register(usecases.marketService, MarketService);
  container.register(usecases.userService, UserService);
  container.register(usecases.groupService, GroupService);
  container.register(usecases.shoppingEventService, ShoppingEventService);
  container.register(usecases.hydrateProductUseCase, HydrateProductUseCase);
  container.register(usecases.manualSearchUseCase, ManualSearchUseCase);
  container.register(usecases.scanProductUseCase, ScanProductUseCase);

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
