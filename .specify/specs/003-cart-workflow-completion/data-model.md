# Data Model: Cart Workflow Completion

## Entities

### PhysicalEAN
- **barcode**: String (Primary Key / Unique)
- **productIdentityId**: UUID (Foreign Key -> ProductIdentity)
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

### ProductIdentity
- **id**: UUID (Primary Key)
- **name**: String
- **brand**: String (Optional)
- **description**: String (Optional)
- **imageUrl**: String (Optional)
- **canonicalProductId**: UUID (Foreign Key -> CanonicalProduct)
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

### ExternalFetchLog
- **id**: UUID (Primary Key)
- **barcode**: String
- **source**: Enum ('OFF', 'UPCITEMDB')
- **rawResponse**: JSONB
- **status**: Enum ('SUCCESS', 'MISS', 'ERROR')
- **createdAt**: Timestamp

### OutboxEvent
- **id**: UUID (Primary Key)
- **type**: String (e.g., 'ProductScanned')
- **payload**: JSONB
- **status**: Enum ('PENDING', 'PROCESSED', 'FAILED')
- **retryCount**: Integer
- **createdAt**: Timestamp
- **processedAt**: Timestamp (Optional)

## Relationships
- `PhysicalEAN` Many -> 1 `ProductIdentity`
- `ProductIdentity` Many -> 1 `CanonicalProduct`
