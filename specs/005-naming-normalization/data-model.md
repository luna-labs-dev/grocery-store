# Naming Inventory: Nature-Role Mapping

**Feature**: Naming Normalization and Semantic Refactor

Maps current names to their new semantic equivalents using the **Nature-Role** pattern.

## 01. Domain UseCases (Interfaces)

| Current Interface | New Interface (Role) | Current File | New File | Status |
|-------------------|----------------------|--------------|----------|--------|
| `ICartService` | `ICartManager` | `cart-service.ts` | `cart.ts` | **Consolidated** |
| `IScanProductUseCase` | - | `scan-product.interface.ts` | - | [DELETE] |
| `IManualSearchUseCase` | - | `manual-search.interface.ts` | - | [DELETE] |
| `IUserService` | `IUserManager` | `user-service.ts` | `user.ts` | Active |
| `IShoppingEventService` | `IShoppingEventManager` | `shopping-event-service.ts` | `shopping-event.ts` | Active |
| `IGroupService` | `IGroupManager` | `group-service.ts` | `group.ts` | Active |
| `IMarketService` | `IMarketManager` | `market-service.ts` | `market.ts` | Active |
| `IHydrateProductUseCase` | `IProductHydrator` | `hydrate-product.interface.ts` | `product-hydrator.ts` | Active |

## 02. Application UseCases (Implementations)

| Current Class | New Class (Nature-Role) | Current File | New File | Nature | Status |
|---------------|-----------|--------------|----------|--------|--------|
| `CartService` | `DbCartManager` | `cart-service.ts` | `db-cart-manager.ts` | DB | **Consolidated** |
| `ScanProductUseCase` | - | `scan-product-use-case.ts` | - | Remote | [DELETE] |
| `ManualSearchUseCase` | - | `manual-search-use-case.ts` | - | Remote | [DELETE] |
| `UserService` | `DbUserManager` | `user-service.ts` | `db-user-manager.ts` | DB | Active |
| `ShoppingEventService` | `DbShoppingEventManager` | `shopping-event-service.ts` | `db-shopping-event-manager.ts` | DB | Active |
| `GroupService` | `DbGroupManager` | `group-service.ts` | `db-group-manager.ts` | DB | Active |
| `MarketService` | `DbMarketManager` | `market-service.ts` | `db-market-manager.ts` | DB | Active |
| `RemoteProductResolver` | `RemoteProductResolver` | `scan-product-use-case.ts` | `remote-product-resolver.ts` | Remote | [REPLACED BY CART] |
| `RemoteProductFinder` | `RemoteProductFinder` | `remote-product-finder.ts` | `remote-product-finder.ts` | Remote | [REPLACED BY CART] |
| `HydrateProductUseCase` | `RemoteProductHydrator` | `hydrate-product-use-case.ts` | `remote-product-hydrator.ts` | Remote | Active |
| `HydrateProductJob` | `JobProductHydrator` | `hydrate-product-job.ts` | `job-product-hydrator.ts` | Job | Active |
| `SearchProductsService` | `RemoteProductFinder` | `search-products-service.ts` | `remote-product-finder.ts` | Remote | [REPLACED BY CART] |
| `PricingConsensusService` | `DbPriceConsensusEngine` | `pricing-consensus-service.ts` | `db-price-consensus-engine.ts` | DB | Active |

## 03. Infrastructure Services (External Clients)

| Current Class | New Class | Current File | New File |
|---------------|-----------|--------------|----------|
| `OpenFoodFactsClient` | `OpenFoodFactsService` | `open-food-facts-client.ts` | `open-food-facts-service.ts` |
| `UpcItemDbClient` | `UpcItemDbService` | `upcitemdb-client.ts` | `upcitemdb-service.ts` |
| `CompositeExternalProductClient` | `CompositeExternalProductService` | `composite-external-product-client.ts` | `composite-external-product-service.ts` |
| `Buidler` | `ResilienceService` | `resilience/buidler.ts` | `resilience/resilience-service.ts` |
