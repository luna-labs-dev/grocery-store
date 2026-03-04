# 01-Auth Strategy: Beyond Clerk

## 1. Why Move? (Elite Backend Architect Scars)
Clerk is "Quick-Start" gold but "Scale-Out" lead.
- **Vendor Lock-in**: Hard to customize session logic for fine-grained permissions.
- **Latency**: Every request hits an external IdP if not carefully cached.
- **Cost**: Per-user pricing scales poorly for consumer retail apps.

## 2. Recommendation: **Better Auth**
For this stack (TS + Drizzle + Fastify), Better Auth is the superior choice over Keycloak.

| Feature                | Better Auth                            | Keycloak                           |
| :--------------------- | :------------------------------------- | :--------------------------------- |
| **Operational Effort** | Low (Runs in your Node process)        | High (Separate JVM service/Docker) |
| **Integration**        | Native Drizzle/TS support              | Standard OIDC (generic)            |
| **Customization**      | Pure TS middleware/plugins             | Java SPIs (complex)                |
| **Performance**        | Zero-latency session checks (DB-local) | Network hop to IdP                 |

## 3. Migration Path

### 3.1 Data Migration
1.  **Export**: Export all users from Clerk (IDs, Emails).
2.  **Import**: Seed our `users` table with Clerk IDs as a reference to avoid breaking existing relations during the transition.
3.  **Password Reset**: Force a password reset for users upon first login with the new system (or use Social Login/Link-based login to bypass).

### 3.2 Backend Integration
- **Plugin**: Register `better-auth` in Fastify.
- **Middleware**: Replace `clerkAuthorizationMiddleware` with a generic `authMiddleware` that populates `request.user`.

## 4. Architectural Directives (Elite Backend Architect)
*   **Session over JWT Bloat**: Use database-backed sessions with strategic Redis caching. This avoids the "Header Too Large" error (SCAR_02) and allows for instant session revocation.
*   **Reference Tokens**: Never expose the full user object in the token. Use an opaque session ID.
*   **Idempotency on Signup**: Ensure the user creation flow is idempotent. If the user is created in the Auth provider but DB insertion fails, the retry must handle it gracefully.

---
**Status**: DRAFT - *Solutions Architect / Elite Backend Architect*
