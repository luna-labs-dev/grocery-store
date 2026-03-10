# API Contracts: Global Product Blueprint

## 🛡️ Authentication Boundary
- **Provider**: Better Auth (Self-hosted).
- **Persistence**: Valkey (Session storage).
- **Endpoint**: `/api/auth/*` (standard Better Auth routes).

## 🏢 Management Contracts

### Group Management
- **GET** `/api/groups`: List user's groups.
- **POST** `/api/groups`: Create new group (Payload: `{name, description}`).
- **POST** `/api/groups/join`: Join via invite code (Payload: `{inviteCode}`).
- **DELETE** `/api/groups/:groupId/members/:memberId`: Evict member (ABAC: Moderator/Owner only).

### Product Intelligence
- **GET** `/api/products/search?q=...`: Search local/external. 
  - **Response**: List of `ProductIdentity` items with resolved hierarchy.
- **POST** `/api/products/report`: Report a price.
  - **Payload**: `{ean, marketId, price}`.

## ⚡ Real-Time Sync (Socket.io)
- **Namespace**: `/shopping`.
- **Rooms**: `group:[groupId]`.
- **Events**:
  - `product:added`: `{itemId, userId, productData}`.
  - `price:updated`: `{itemId, price, reporterId}`.
  - `session:joined`: `{userId, userName, userImage}`.

## 📐 Schema Validation
- **Backend**: `zod` + `fastify-type-provider-zod`.
- **Frontend**: Types generated via Orval (to be verified in Audit).
