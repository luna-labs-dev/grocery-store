# 02-ABAC Design: Fine-Grained Permissions

## 1. Why ABAC?
Role-Based Access Control (RBAC) is too binary ("Is User an Admin?"). In this app, permissions depend on relationships:
- *"Can I edit this list?"* (Yes, if I am a member of the Group that owns it).
- *"Can I verify this price?"* (Yes, if my reputation score is > 50).

## 2. Policy Components

### 2.1 Subject (The User)
- **`roles`**: `[ADMIN, MEMBER, ANONYMOUS]`
- **`groupIds`**: `[uuid, uuid]`
- **`reputationScore`**: `int` (Crowdsourcing trust metric)

### 2.2 Resource (The Object)
- **`type`**: `[PRODUCT, SHOPPING_EVENT, LIST, GROUP]`
- **`ownerId`**: `uuid`
- **`groupId`**: `uuid`
- **`status`**: `[DRAFT, VERIFIED, ARCHIVED]`

### 2.3 Action
- `CREATE`, `READ`, `UPDATE`, `DELETE`, `VERIFY_PRICE`, `INVITE_MEMBER`

## 3. Sample Policies (The "Rules")

| Action         | Resource         | Condition                                    |
| :------------- | :--------------- | :------------------------------------------- |
| `UPDATE`       | `SHOPPING_LIST`  | `subject.groupIds CONTAINS resource.groupId` |
| `VERIFY_PRICE` | `PRODUCT_PRICE`  | `subject.reputationScore >= 50`              |
| `DELETE`       | `GROUP`          | `subject.id == resource.ownerId`             |
| `READ`         | `SHOPPING_EVENT` | `subject.groupIds CONTAINS resource.groupId` |

## 4. Implementation Strategy (Elite Backend Architect)

### 4.1 The Permission Service
Create a `PermissionService.can(subject, action, resource, context)` method.
- **TDD First**: "Scenario: User from Group A attempts to edit List from Group B -> Result: DENY".
- **Performance**: Permission checks must be O(1) or O(log N). Cache subject attributes (groups, reputation) in the session object to avoid N+1 database queries.

### 4.2 Middleware vs. UseCase
- **Middleware**: Handles coarse-grained checks (e.g., "Is the user authenticated?").
- **UseCase Layer**: Handles fine-grained ABAC logic. The UseCase should receive the `User` object and perform the check before executing the core logic.

## 5. Architectural Scars (Elite Backend Architect)
*   **SCAR_04: Cache Inconsistency**: User leaves a group but the session still says they are a member.
    *   *Solution*: Implement a "Session Version" or "Group List Hash". If the group list changes, the session is invalidated or updated immediately.
*   **The "Super-Admin" Bypass**: Never hardcode an "admin" bypass string. Instead, give the Admin role all attributes required to satisfy every policy.

---
**Status**: DRAFT - *Solutions Architect / Elite Backend Architect*
