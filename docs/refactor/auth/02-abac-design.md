# 02-ABAC Design: Fine-Grained Permissions

## 1. Why ABAC?
Role-Based Access Control (RBAC) is too binary ("Is User an Admin?"). In this app, permissions depend on relationships:
- *"Can I edit this list?"* (Yes, if I am a member of the Group that owns it).
- *"Can I verify this price?"* (Yes, if my reputation score is > 50).

## 2. Policy Components

### 2.1 Subject (The User)
- **`roles`**: `[MASTER, ADMIN, MODERATOR, MEMBER, ANONYMOUS]`
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

| Action          | Resource          | Condition                                                                  |
| :-------------- | :---------------- | :------------------------------------------------------------------------- |
| `UPDATE`        | `SHOPPING_LIST`   | `subject.groupIds CONTAINS resource.groupId`                               |
| `VERIFY_PRICE`  | `PRODUCT_PRICE`   | `subject.reputationScore >= settings.MIN_REPUTATION_FOR_VERIFICATION`      |
| `DELETE`        | `GROUP`           | `subject.id == resource.ownerId OR subject.roles CONTAINS [MASTER, ADMIN]` |
| `READ`          | `SHOPPING_EVENT`  | `subject.groupIds CONTAINS resource.groupId`                               |
| `MANAGE_CONFIG` | `SYSTEM_SETTINGS` | `subject.roles CONTAINS [MASTER, ADMIN]`                                   |
| `VIEW_LOGS`     | `SYSTEM_LOGS`     | `subject.roles CONTAINS [MASTER, ADMIN, MODERATOR]`                        |

## 4. Implementation Strategy (Elite Backend Architect)

### 4.1 The Permission Service
Create a `PermissionService.can(subject, action, resource, context)` method.
- **TDD First**: "Scenario: User from Group A attempts to edit List from Group B -> Result: DENY".
- **Performance**: Permission checks must be O(1) or O(log N). Cache subject attributes (groups, reputation) in the session object to avoid N+1 database queries.

### 4.2 Configurable Thresholds
Thresholds must NOT be hardcoded.
- **Level 1**: Environment Variables (Static, e.g., `MIN_REPUTATION_FOR_VERIFICATION`).
- **Level 2**: Database Settings table (Dynamic, allows Master/Admin to tweak via UI).
- **Defaulting**: Code must default to safe Env values if DB values are missing.

### 4.3 Ops Governance & Visibility
The system must expose observability for "Power Users":
- **Master/Admin**: Full configuration control, audit log access, health dashboards.
- **Moderator**: Access to logs and issue resolution flows (e.g., flagging bad prices).

## 5. Architectural Scars (Elite Backend Architect)
*   **SCAR_04: Cache Inconsistency**: User leaves a group but the session still says they are a member.
    *   *Solution*: Implement a "Session Version" or "Group List Hash". If the group list changes, the session is invalidated or updated immediately.
*   **The "Super-Admin" Bypass**: Never hardcode an "admin" bypass string. Instead, give the Admin role all attributes required to satisfy every policy.

---
**Status**: DRAFT - *Solutions Architect / Elite Backend Architect*
