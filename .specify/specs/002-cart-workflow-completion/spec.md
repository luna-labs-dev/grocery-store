# Feature Specification: Cart Workflow Completion

**Feature Branch**: `002-cart-workflow-completion`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "Complete Cart Workflow: Implement product scanning with external API fallback (OFF/UPCitemdb) and manual search."

## Team & Specialist Guidance

This feature involves complex integration and state management. The following specialists must be consulted during implementation:

- **🏛️ Backend Architect Elite**: Guardian of Clean Architecture. Ensures UseCases for scanning and searching remain in the Domain layer and are properly mapped from API schemas.
- **🛒 Retail Nexus Veteran**: Domain expert. Ensures variable-weight barcode logic (EAN-13 starting with '2') is implemented and circuit breakers for external APIs are strictly enforced.
- **🔄 Flow Coordinator**: State management lead. Orchestrates the transition from "Scanning" to "External Fetch" to "Confirm Price".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Product Scanning with Internal Match (Priority: P1)

As a shopper, I want to scan a product's barcode and have it instantly recognized from our local database so I can add it to my cart quickly.

**Why this priority**: Core interaction for the shopping experience.

**Independent Test**: Scan an EAN-13 barcode that exists in the local `physical_eans` table. Verify it maps correctly to a `ProductIdentity`.

**Acceptance Scenarios**:

1. **Given** a barcode "7891234567890" exists in the DB, **When** I scan it, **Then** the app shows the matching "Coca-Cola 350ml" and its last known price.

---

### User Story 2 - External API Fallback (OFF/UPCitemdb) (Priority: P1)

As a shopper, I want the system to search external databases when a scanned barcode is missing locally so I don't have to enter the data manually.

**Why this priority**: Essential for building the "Golden Product" catalog through crowdsourcing.

**Independent Test**: Scan a barcode not in the local DB. Verify the `ExternalProductClient` triggers and hydrates the local database with fetched data.

**Acceptance Scenarios**:

1. **Given** a barcode "1234567890123" not in our DB, **When** I scan it, **Then** the system fetches data from Open Food Facts, creates a new `ProductIdentity`, and prompts for price.
2. **Given** external APIs are down or slow (>2000ms), **When** scanning occurs, **Then** the system falls back to manual data entry without blocking the UI.

---

### User Story 3 - Manual Search & Selection (Priority: P2)

As a shopper, I want to search for products by name when a barcode is unreadable or missing so I can still add items to my cart.

**Why this priority**: Essential fallback for broken labels or loose produce.

**Independent Test**: Perform a fuzzy search in the UI and select a product from the results.

**Acceptance Scenarios**:

1. **Given** a search query "Apples", **When** I search, **Then** I see a list of matched `CanonicalProducts` or `ProductIdentities` to choose from.

---

### User Story 4 - Variable-Weight Barcode Support (Priority: P3)

As a shopper, I want the system to recognize variable-weight barcodes (e.g., from the deli counter) so the price is calculated correctly based on weight.

**Why this priority**: Required for hypermarket completeness.

**Acceptance Scenarios**:

1. **Given** an EAN-13 starting with "2", **When** scanned, **Then** the system extracts the weight/price embedded in the barcode as per industry standards.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a scanner interface that captures EAN-13/UPC barcodes.
- **FR-002**: System MUST first query the local `physical_eans` table before external calls.
- **FR-003**: System MUST implement `ExternalProductClient` with support for Open Food Facts and UPCitemdb.
- **FR-004**: External API calls MUST have a circuit breaker/timeout of 2000ms.
- **FR-005**: Successfully fetched external products MUST be persisted to the local database (Outbox pattern recommended for background hydration).
- **FR-006**: System MUST provide a fuzzy search endpoint for manual product lookup.

### Key Entities

- **PhysicalEAN**: Mapping of barcode to Product Identity.
- **ProductIdentity**: The specific variant found or created.
- **ExternalFetchLog**: Audit of external API hits/misses.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Local matches resolved in under 100ms.
- **SC-002**: External fallbacks resolve (or fail to manual) in under 2500ms total.
- **SC-003**: 100% of newly fetched products are correctly categorized under a `CanonicalProduct`.

## Assumptions

- We assume the camera hardware is capable of clear barcode capture.
- We assume Open Food Facts is the primary external source due to OSS alignment.
