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
  DbAddFamily,
  DbAddProductToCart,
  DbAddUser,
  DbEndShoppingEvent,
  DbGetFamily,
  DbGetMarketById,
  DbGetMarketList,
  DbGetShoppingEventById,
  DbGetShoppingEventList,
  DbGetUser,
  DbJoinFamily,
  DbLeaveFamily,
  DbRemoveFamilyMember,
  DbRemoveProductFromCart,
  DbStartShoppingEvent,
} from '@/application';
import type {
  FamilyRepositories,
  MarketRepositories,
  Places,
  ProductRepositories,
  ShoppingEventRepositories,
  UserRepositories,
} from '@/application/contracts';
import { DbUpdateProductInCart } from '@/application/usecases/shopping-event/cart/db-update-product-in-cart';
import type {
  AddFamily,
  AddProductToCart,
  AddUser,
  EndShoppingEvent,
  GetFamily,
  GetMarketById,
  GetMarketList,
  GetShoppingEventById,
  GetShoppingEventList,
  GetUser,
  JoinFamily,
  LeaveFamily,
  RemoveFamilyMember,
  RemoveProductFromCart,
  StartShoppingEvent,
  UpdateProductInCart,
} from '@/domain';
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
      return new GooglePlacesHttpClient({
        apiKey,
        baseURL,
      });
    },
  });
  container.register<Places>(infra.places, GooglePlaces);

  // Usecases
  container.register<GetMarketList>(usecases.getMarketList, DbGetMarketList);
  container.register<GetMarketById>(usecases.getMarketById, DbGetMarketById);
  container.register<StartShoppingEvent>(
    usecases.startShoppingEvent,
    DbStartShoppingEvent,
  );
  container.register<EndShoppingEvent>(
    usecases.endShoppingEvent,
    DbEndShoppingEvent,
  );
  container.register<GetShoppingEventList>(
    usecases.getShoppingEventList,
    DbGetShoppingEventList,
  );
  container.register<GetShoppingEventById>(
    usecases.getShoppingEventById,
    DbGetShoppingEventById,
  );
  container.register<AddProductToCart>(
    usecases.addProductToCart,
    DbAddProductToCart,
  );
  container.register<UpdateProductInCart>(
    usecases.updateProductInCart,
    DbUpdateProductInCart,
  );
  container.register<RemoveProductFromCart>(
    usecases.removeProductFromCart,
    DbRemoveProductFromCart,
  );
  container.register<GetUser>(usecases.getUser, DbGetUser);
  container.register<AddUser>(usecases.addUser, DbAddUser);
  container.register<AddFamily>(usecases.addFamily, DbAddFamily);
  container.register<JoinFamily>(usecases.joinFamily, DbJoinFamily);
  container.register<LeaveFamily>(usecases.leaveFamily, DbLeaveFamily);
  container.register<GetFamily>(usecases.getFamily, DbGetFamily);
  container.register<RemoveFamilyMember>(
    usecases.removeFamilyMember,
    DbRemoveFamilyMember,
  );

  // Api

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
