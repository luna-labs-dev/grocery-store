# Data Model: Cart Workflow Completion

## Entities

### PhysicalEAN
Mapping of a physical barcode to a Product Identity.
- **id**: UUID (PK)
- **barcode**: String (Indexed, Unique)
- **productIdentityId**: UUID (FK -> ProductIdentity)
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

### ProductIdentity
The specific variant of a product (e.g., "Coca-Cola 350ml").
- **id**: UUID (PK)
- **canonicalProductId**: UUID (FK -> CanonicalProduct)
- **name**: String
- **brand**: String (Optional)
- **imageUrl**: String (Optional)
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

### ExternalFetchLog
Audit log for external API requests.
- **id**: UUID (PK)
- **barcode**: String
- **source**: Enum ('OPEN_FOOD_FACTS', 'UPC_ITEM_DB')
- **rawResponse**: JSONB
- **status**: Enum ('SUCCESS', 'NOT_FOUND', 'ERROR')
- **createdAt**: Timestamp

### OutboxEvent
Events for background hydration.
- **id**: UUID (PK)
- **type**: String ('EXTERNAL_PRODUCT_FETCHED')
- **payload**: JSONB
- **processedAt**: Timestamp (Nullable)
- **createdAt**: Timestamp

## Relationships
- **PhysicalEAN** (N:1) -> **ProductIdentity**
- **ProductIdentity** (N:1) -> **CanonicalProduct**
- **ExternalFetchLog** (1:1) -> **OutboxEvent** (Conceptually linked by barcode/timestamp)
