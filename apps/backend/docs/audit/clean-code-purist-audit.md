# 💎 Clean Code Audit: Elegant & Maintainable Suggestions

> [!IMPORTANT]
> **OBSERVATION**: This file is a temporary architectural roadmap. It MUST be deleted once the final versions of the suggested refactors are implemented and approved.

This audit was conducted by the **Clean Code Purist**. The focus is on narrowing complexity, enforcing SOLID principles, and ensuring the architecture is "spot on" for future scaling.

## 1. 🛑 Stop the Authorization Boilerplate (DRY Violation)

### Observation
Almost every method in `ShoppingEventService` and `GroupService` starts with:
```typescript
const user = await this.userRepository.getById(userId);
if (!user) throw new UserNotFoundException();
if (!hasGroupPermission(user, ...)) throw ...
```

### The "Elegance" Suggestion
This is **crap from the ass**. It clutters the business logic.
- **Narrowed Solution**: Use a higher-order function or a dedicated **Authorization Guard** in the Fastify layer (or a Decorator) to inject the validated `User` and `Permission` context *before* it reaches the Service. The Service should ideally receive a `Requester` context.

## 2. 🛡️ Enhance Aggregate Root Encapsulation (SOLID: S & O)

### Observation
Services are micromanaging the internal state of entities:
- `GroupService` directly touches `group.props.members`.
- `ShoppingEventService` manually clones and re-adds products to the `products` collection.

### The "Purist" Suggestion
- **In `CollaborationGroup`**: Add an `addOwner(userId)` method or include the owner in the `create` factory. Never let a service touch `props`.
- **In `ShoppingEvent`**: Implement `upsertProduct(productId, data)`. The service shouldn't know how to "clone" a product; it should just tell the aggregate what the user wants to change. The aggregate root is the ONLY one allowed to mutate its internal collection rules.

## 3. ⚖️ Exception Categorization (Clarity)

### Observation
Misleading exceptions:
- `ShoppingEventService` throws `ShoppingEventNotFoundException` when a user lacks permissions. This is technically a lie.

### The "Spot On" Suggestion
- Use `UnauthorizedGroupOperationException` (which you already have) consistently for all permission failures. A "NotFound" should only mean the record literally doesn't exist in the DB.

## 4. 🧩 Service Splitting (ISP - Interface Segregation)

### Observation
`ShoppingEventService` is becoming a "God Service", handling everything from pagination to complex cart mutations.

### The "Simplicity" Suggestion
- **Split it**:
    - `ShoppingEventService`: Orchestrates the lifecycle (Start, End, List, Get).
    - `CartService`: Specifically handles the "Product in Cart" mutations (Add, Update, Remove).
- This keeps the interfaces small and focused, making them significantly easier to test and maintain.

## 5. 🏗️ Repository Contract Audit

### Observation
`GroupRepository` has `addMember`. While okay, it can lead to "Side-loading" members without going through the `CollaborationGroup` aggregate root's rules.

### The "Architecture" Suggestion
- Ensure that for any change involving members *within a business context* (like joining or promoting), we fetch the `CollaborationGroup` Aggregate, perform the change on the aggregate, and save the aggregate. The repository should be a collection of **Root Aggregates**.

---
*Signed,*  
**The Clean Code Purist** ✨
