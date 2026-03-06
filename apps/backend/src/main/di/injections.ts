import { container } from 'tsyringe';
import { env } from '../config/env';
import type { FastifyTypedInstance } from '../fastify/types';
import { injection } from './injection-tokens';
import {
  AdminController,
  AuthController,
  CartController,
  type FastifyController,
  GroupController,
  MarketController,
  ShoppingEventController,
} from '@/api';
import {
  CartService,
  GroupService,
  MarketService,
  ShoppingEventService,
  UserService,
} from '@/application';
import {
  ConfigService,
  DrizzleGroupRepository,
  DrizzleMarketRepository,
  DrizzleProductRepository,
  DrizzleSettingsRepository,
  DrizzleShoppingEventRepository,
  DrizzleUserRepository,
  GooglePlaces,
  GooglePlacesHttpClient,
  SecurityPermissionService,
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
  // Services
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

  // Usecases
  container.register(usecases.cartService, { useClass: CartService });
  container.register(usecases.marketService, { useClass: MarketService });
  container.register(usecases.userService, { useClass: UserService });
  container.register(usecases.groupService, { useClass: GroupService });
  container.register(usecases.shoppingEventService, {
    useClass: ShoppingEventService,
  });

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
