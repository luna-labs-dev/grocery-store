# Quickstart: Global Product Blueprint

## 🚀 Running the Full-Stack Audit
To verify the implementation against this blueprint:

1. **Backend Unit/Int Tests**:
   ```bash
   cd apps/backend
   npm run test:all
   ```

2. **Frontend Audit (New)**:
   ```bash
   cd apps/frontend
   # Placeholder for future test:behavior script
   npm run typecheck
   ```

3. **Master Audit Script (Conceptual)**:
   ```bash
   ./.specify/scripts/bash/check-prerequisites.sh --all-features
   ```

## 🧪 Testing the CUJs
To manually verify the Critical User Journeys:
- **Auth**: Use the `/api/auth` endpoints to verify session persistence in Valkey.
- **Sync**: Open two browser tabs on the same Group Shopping Event and verify real-time updates.
- **Hierarchy**: Scan a product and verify in the DB that it correctly resolves to a `ProductIdentity` and `CanonicalProduct`.
