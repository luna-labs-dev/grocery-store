# API Exception Contract

This contract defines the structure of all exception responses returned by the Grocery Store API.

## Standard Success Response
`HTTP 2xx`: Returns the requested data or `204 No Content`.

## Standard Exception Response
`HTTP 4xx` or `5xx`: Returns a JSON object following the structure below.

```json
{
  "code": "STRING_UPPER_SNAKE_CASE",
  "message": "Human-readable description of what went wrong",
  "stack": "Optional stack trace (only in dev/staging environments)",
  "userId": "Sample spread property from context",
  "otherProp": "Another spread property"
}
```

### Response Header
- **Content-Type**: `application/json; charset=utf-8`

### Field Definitions
| Field | Type | Required | Description |
|---|---|---|---|
| code | string | Yes | Unique literal exception identifier. |
| message | string | Yes | Human-readable exception message. |
| stack | string | No | Trace for debugging (hidden in production). |
| ... | any | No | Custom properties spread from the exception context. |

## PII & Security

> [!WARNING]
> To comply with **FR-008**, the legacy `context` field is **forbidden** in public responses. All data MUST be spread into the root and sanitized against the global PII blacklist.

1. **Automatic Scrubbing**: Any field matching the `PII_SENSITIVE_FIELDS` (e.g., `ssn`, `password`, `creditCard`) is automatically removed.
2. **Environment Isolation**: The `stack` field is strictly excluded in production via the global exception handler logic.
