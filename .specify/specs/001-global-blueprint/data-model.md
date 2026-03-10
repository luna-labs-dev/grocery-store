# Data Model: Global Product Blueprint

## 📦 Golden Product Hierarchy

### CanonicalProduct
Represented by the conceptual brand/product group.
- **Fields**: `id` (UUID), `name` (String), `brand` (String), `category` (String).
- **Relationships**: One-to-Many with `ProductIdentity`.

### ProductIdentity (SKU)
The specific variant (size, flavor).
- **Fields**: `id` (UUID), `canonicalId` (UUID), `name` (String), `volumeWeight` (Float), `unit` (Enum: ml, g, kg, l).
- **Relationships**: Many-to-One with `CanonicalProduct`, One-to-Many with `ProductEAN`.

### ProductEAN
The physical barcode mapping.
- **Fields**: `ean` (String, PK), `productIdentityId` (UUID), `editionName` (String).
- **Validation**: Must be valid EAN-13 (13 digits) or UPC (12 digits).

---

## 👥 Flexible Groups & Sharing

### Group
The collaboration container.
- **Fields**: `id` (UUID), `name` (String), `inviteCode` (String, Unique), `createdBy` (UUID).
- **Relationships**: Many-to-Many with `User` via `GroupMember`.

### GroupMember
Linking users to groups with roles.
- **Fields**: `groupId` (UUID), `userId` (UUID), `role` (Enum: owner, moderator, member), `joinedAt` (DateTime).
- **Validation**: Exactly one `owner` per group.

---

## 🛒 Shopping & Pricing

### ShoppingEvent
A live shopping session.
- **Fields**: `id` (UUID), `groupId` (UUID), `marketId` (UUID), `status` (Enum: active, completed, cancelled).

### ProductPriceReport
Crowdsourced price data.
- **Fields**: `id` (UUID), `userId` (UUID), `marketId` (UUID), `ean` (String), `price` (Decimal), `timestamp` (DateTime).
- **Validation**: `price` must be > 0.
