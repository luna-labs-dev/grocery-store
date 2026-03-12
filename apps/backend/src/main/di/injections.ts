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
  ProductController,
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
  container.register(infra.userRepositories, {
    useClass: DrizzleUserRepository,
  });
  container.register(infra.marketRepositories, {
    useClass: DrizzleMarketRepository,
  });
  container.register(infra.groupRepositories, {
    useClass: DrizzleGroupRepository,
  });
  container.register(infra.shoppingEventRepositories, {
    useClass: DrizzleShoppingEventRepository,
  });
  container.register(infra.productRepositories, {
    useClass: DrizzleProductRepository,
  });
  container.register(infra.canonicalProductRepositories, {
    useClass: DrizzleCanonicalProductRepository,
  });
  container.register(infra.productIdentityRepositories, {
    useClass: DrizzleProductIdentityRepository,
  });
  container.register(infra.outboxEventRepositories, {
    useClass: DrizzleOutboxEventRepository,
  });
  container.register(infra.physicalEanRepository, {
    useClass: DrizzlePhysicalEanRepository,
  });
  container.register(infra.externalFetchLogRepository, {
    useClass: DrizzleExternalFetchLogRepository,
  });

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
  container.register(infra.places, { useClass: GooglePlaces });
  container.register(infra.configService, { useClass: ConfigService });
  container.register(infra.settingsRepository, {
    useClass: DrizzleSettingsRepository,
  });
  container.register(infra.permissionService, {
    useClass: SecurityPermissionService,
  });
  container.register(infra.openFoodFactsClient, {
    useClass: OpenFoodFactsClient,
  });
  container.register(infra.upcItemDbClient, {
    useClass: UpcItemDbClient,
  });
  container.register(infra.compositeProductClient, {
    useClass: CompositeExternalProductClient,
  });
  container.register(Buidler, { useClass: Buidler });

  // Usecases
  container.register(usecases.cartService, { useClass: CartService });
  container.register(usecases.marketService, { useClass: MarketService });
  container.register(usecases.userService, { useClass: UserService });
  container.register(usecases.groupService, { useClass: GroupService });
  container.register(usecases.shoppingEventService, {
    useClass: ShoppingEventService,
  });
  container.register(usecases.hydrateProductUseCase, {
    useClass: HydrateProductUseCase,
  });
  container.register(usecases.manualSearchUseCase, {
    useClass: ManualSearchUseCase,
  });
  container.register(usecases.scanProductUseCase, {
    useClass: ScanProductUseCase,
  });

  // Fastify Instance
  container.registerInstance<FastifyTypedInstance>('FastifyInstance', app);

  // Fastify Controllers
  container.register<FastifyController>(controllers.fastify, AuthController);
  container.register<FastifyController>(controllers.fastify, GroupController);
  container.register<FastifyController>(controllers.fastify, MarketController);
  container.register<FastifyController>(controllers.fastify, ProductController);
  container.register<FastifyController>(
    controllers.fastify,
    ShoppingEventController,
  );
  container.register<FastifyController>(controllers.fastify, CartController);
  container.register<FastifyController>(controllers.fastify, AdminController);
};
