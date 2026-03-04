# 01-Real-Time Sync: The Live Shopping Experience

## 1. Why Real-Time?
Grocery shopping is often a collaborative effort. If User A adds a product to the cart, User B should see it instantly to avoid duplicate purchases and ensure the shopping event remains synchronized.

## 2. Technical Architecture: **Socket.io + Rooms**

For the current scale and stack, **Socket.io** is the most pragmatic choice. It provides out-of-the-box support for rooms, automatic reconnection, and fallback mechanisms.

### 2.1 The "Room" Strategy
- **Namespace**: `/shopping`
- **Room ID**: `group:{groupId}` or `event:{eventIds}`
- **Flow**: When a user joins a shopping event, they automatically join the room associated with the `groupId` or `shoppingEventId`.

### 2.2 Event Types
| Event             | Direction        | Payload                               |
| :---------------- | :--------------- | :------------------------------------ |
| `product_added`   | Server -> Client | `{ productId, name, price, addedBy }` |
| `product_updated` | Server -> Client | `{ productId, newPrice, newAmount }`  |
| `product_deleted` | Server -> Client | `{ productId }`                       |
| `total_updated`   | Server -> Client | `{ newTotal, newCount }`              |

## 3. Scalability & Evolution (Elite Backend Architect)

### Phase 1: Simple & Cheap (Current)
- **Engine**: Socket.io running on the same Fastify instance.
- **State**: In-memory room management.
- **Limit**: Local to a single server instance.

### Phase 2: Distributed (Evolution)
- **Add Redis Adapter**: Use `socket.io-redis` to sync events across multiple server instances.
- **Pub/Sub**: The backend services publish events to Redis, and the Socket.io adapter broadcasts them to the correct rooms.

### Phase 3: Event-Driven Architecture
- **Message Broker**: Introduce RabbitMQ or Kafka.
- **Outbox Pattern**: Ensure that database updates and real-time notifications are atomic to prevent "ghost" updates (SCAR_05).

## 4. Conflict Resolution (Offline-First Sync)
If a user is shopping in a poor-signal area (common in hypermarkets):
1.  **Optimistic UI**: The item is added locally immediately.
2.  **Queue**: The update is queued for when connection returns.
3.  **Conflict**: If two users update the same item while offline, we use the **"Group Master"** or **"Last-Write-Wins"** strategy with a logical clock (Lamport Timestamps).

---
**Status**: DRAFT - *Solutions Architect / Elite Backend Architect*
