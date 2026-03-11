# Data Model: Cart Workflow Completion

## Entities

### PhysicalEAN (Lookup Optimization)
Mapping of physical barcodes to product identities.
- `barcode`: `varchar(256)` (Primary Key / Unique Index)
- `productIdentityId`: `uuid` (References `product_identity.id`)
- `source`: `varchar(50)` (e.g., 'LOCAL', 'OFF', 'UPCITEMDB')
- `createdAt`: `timestamp`

### ProductIdentity (Refined)
The specific variant found or created.
- `id`: `uuid` (Primary Key)
- `canonicalProductId`: `uuid` (References `canonical_product.id`)
- `type`: `varchar(50)` (e.g., 'EAN', 'PLU')
- `value`: `varchar(256)` (The barcode or internal code)
- `name`: `varchar(256)` (Variant name, e.g., "Coca-Cola 350ml")
- `brand`: `varchar(256)`
- `imageUrl`: `text`

### ExternalFetchLog
Audit trail for external API interactions.
- `id`: `uuid` (Primary Key)
- `barcode`: `varchar(256)`
- `source`: `enum('OFF', 'UPCITEMDB')`
- `status`: `enum('SUCCESS', 'MISS', 'ERROR')`
- `durationMs`: `integer`
- `responsePayload`: `jsonb`
- `createdAt`: `timestamp`

## Relationships

- `PhysicalEAN` (1) -> (1) `ProductIdentity`
- `ProductIdentity` (*) -> (1) `CanonicalProduct`
- `Product` (*) -> (1) `ProductIdentity` (in a Shopping Session)
