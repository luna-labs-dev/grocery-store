import { container } from 'tsyringe';
import { env } from '../config/env';
import type { FastifyTypedInstance } from '../fastify/types';
import { app } from '../server';
import { injection } from './injection-tokens';
import {
  CartController,
  FamilyController,
  type FastifyController,
  MarketController,
  ShoppingEventController,
  WebhookAuthController,
} from '@/api';
import {
  FamilyService,
  MarketService,
  ShoppingEventService,
  UserService,
} from '@/application';
import type {
  FamilyRepositories,
  MarketRepositories,
  Places,
  ProductRepositories,
  ShoppingEventRepositories,
  UserRepositories,
} from '@/application/contracts';
import {
  DrizzleFamilyRepository,
  DrizzleMarketRepository,
  DrizzleProductRepository,
  DrizzleShoppingEventRepository,
  DrizzleUserRepository,
  GooglePlaces,
  GooglePlacesHttpClient,
} from '@/infrastructure';

const { application, infra, usecases, controllers } = injection;
const { googlePlaces } = env;

export const registerInjections = () => {
  // Application
  container.registerInstance<FastifyTypedInstance>(application.fastify, app);

  // Infra
  container.register<MarketRepositories>(
    infra.marketRepositories,
    DrizzleMarketRepository,
  );
  container.register<UserRepositories>(
    infra.userRepositories,
    DrizzleUserRepository,
  );
  container.register<FamilyRepositories>(
    infra.familyRepositories,
    DrizzleFamilyRepository,
  );
  container.register<ShoppingEventRepositories>(
    infra.shoppingEventRepositories,
    DrizzleShoppingEventRepository,
  );
  container.register<ProductRepositories>(
    infra.productRepositories,
    DrizzleProductRepository,
  );

  container.register<GooglePlacesHttpClient>(infra.placesHttpClient, {
    useFactory: () => {
      const { apiKey, baseURL } = googlePlaces;
      return new GooglePlacesHttpClient({ apiKey, baseURL });
    },
  });
  container.register<Places>(infra.places, GooglePlaces);

  // Usecases — domain services
  container.register<FamilyService>(usecases.familyService, FamilyService);
  container.register<ShoppingEventService>(
    usecases.shoppingEventService,
    ShoppingEventService,
  );
  container.register<MarketService>(usecases.marketService, MarketService);
  container.register<UserService>(usecases.userService, UserService);

  // Fastify Controllers
  container.register<FastifyController>(controllers.fastify, FamilyController);
  container.register<FastifyController>(controllers.fastify, MarketController);
  container.register<FastifyController>(
    controllers.fastify,
    ShoppingEventController,
  );
  container.register<FastifyController>(controllers.fastify, CartController);
  container.register<FastifyController>(
    controllers.fastify,
    WebhookAuthController,
  );
};
