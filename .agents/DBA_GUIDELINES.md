# DBA Guidelines - Grocery Store Project

These guidelines ensure data integrity, consistency, and professional standards for all database-related operations and schema designs.

## 1. Atomicity & Transactions

All write operations involving multiple tables or dependent records MUST be executed within a database transaction.

### Rules
- **Multi-step Writes**: If an operation creates/updates/deletes more than one record that must exist together (e.g., creating a Group and its first Member), use a transaction.
- **Fail Fast, Rollback**: Any failure within a transactional block must trigger a full rollback to prevent inconsistent states (e.g., orphan records).
- **Clean Architecture Implementation**: Orchestrate transactions at the Service (Use Case) layer using a `TransactionManager` to avoid implementation leakage while maintaining domain integrity.

## 2. Naming Conventions

Consistency in naming is critical for maintainability and external API clarity.

### Enums and Statuses
- **Case**: Always use **lowercase**.
- **Delimiters**: Use **hyphens** (`-`) for multiple words (kebab-case).
- **Avoid Abbreviations**: Use clear, descriptive names.
- **Example**: `ongoing`, `partially-filled`, `waiting-for-review`.

### Roles
- **Case**: Always use **lowercase**.
- **Delimiters**: Use **hyphens** (`-`) if needed.
- **Example**: `owner`, `moderator`, `super-admin`.

### Tables and Columns
- **Tables**: Use snake_case (e.g., `shopping_event`, `group_member`).
- **Columns**: Use camelCase (following TypeScript entity conventions for easier mapping) or snake_case depending on current project established patterns. *Note: Current project uses camelCase for columns in Drizzle (e.g., `inviteCode`).*

## 3. Schema Design

- **Primary Keys**: Always use UUIDs for new tables unless there is a strong reason for another type.
- **Audit Fields**: Every table should ideally have `createdAt` and `updatedAt`/`lastUpdatedAt` timestamps.
- **Soft Deletes**: Consider using a `deletedAt` column instead of hard deletes for important domain entities.
