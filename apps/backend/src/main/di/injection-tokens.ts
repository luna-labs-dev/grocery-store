export const injection = {
  application: {
    fastify: 'fastify-app',
  },
  infra: {
    marketRepositories: 'market-repositories',
    userRepositories: 'user-repositories',
    groupRepositories: 'group-repositories',
    shoppingEventRepositories: 'shopping-event-repositories',
    productRepositories: 'product-repositories',
    canonicalProductRepositories: 'canonical-product-repositories',
    productIdentityRepositories: 'product-identity-repositories',
    userInfo: 'user-info-service',

    placesHttpClient: 'places-http-client',
    places: 'places-service',
    configService: 'config-service',
    settingsRepository: 'settings-repository',
    permissionService: 'permission-service',
  },
  usecases: {
    cartService: 'cart-service',
    groupService: 'group-service',
    shoppingEventService: 'shopping-event-service',
    marketService: 'market-service',
    userService: 'user-service',
  },
  controllers: {
    fastify: 'fastify-controllers',
  },
};
