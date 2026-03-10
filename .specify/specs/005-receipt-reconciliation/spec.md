# Feature Specification: Receipt Reconciliation & Fiscal Audit

**Feature Branch**: `005-receipt-reconciliation`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: [Grocery Store Constitution](./../../memory/constitution.md) - Principle VII: Fiscal Ground Truth & Audit Integrity

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automated Session Audit (Priority: P1)

As a shopper, I want to scan my supermarket receipt (NFC-e) so that my shopping list is automatically verified against official fiscal data.

**Why this priority**: Implements the "Supreme Source of Truth" principle. Ensures that price reports are verified by actual transaction data.

**Independent Test**: Mock an NFC-e QR code/URL, submit it to the system, and verify that the items in the current shopping session are updated with the official prices from the receipt.

**Acceptance Scenarios**:

1. **Given** an active shopping session with "Product A" manually entered at $5.50, **When** a valid NFC-e is uploaded showing "Product A" at $5.45, **Then** the session price MUST be updated to $5.45 and marked as "Fiscal Verified".
2. **Given** a receipt with items not in the current session, **When** reconciled, **Then** the system should suggest adding these items to the "Golden Product" engine.

---

### User Story 2 - Price Delta Identification (Priority: P2)

As a consumer advocate, I want the system to highlight the difference between the price on the shelf (manually reported) and the price at the checkout (fiscal) so that I can identify overcharging.

**Why this priority**: Core value of transparency and consumer protection.

**Independent Test**: Compare manual price reports with fiscal data and verify that a "Price Delta Report" is generated for the market.

**Acceptance Scenarios**:

1. **Given** a manual report of $10.00 for "Item X", **When** the fiscal record shows $10.50, **Then** a "Negative Price Delta" alert is generated for the user and the market reputation is updated.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support fetching Brazilian NFC-e data via SEFAZ proxy using the access key or QR code URL.
- **FR-002**: System MUST implement a `NfcEDecoder` to extract EANs, descriptions, quantities, and unit prices.
- **FR-003**: System MUST implement a `ReconciliationEngine` to match receipt items to `ProductIdentity` items in the local database.
- **FR-004**: System MUST trigger an automatic Price Report update for all items in a reconciled receipt.
- **FR-005**: System MUST mark prices derived from fiscal data with a "Fiscal Truth" flag, which supersedes user-contributed reports.

### Key Entities

- **FiscalRecord**: Cached data from the SEFAZ response.
- **FiscalItem**: Individual product entries within a fiscal record.
- **PriceAudit**: Log of discrepancies between manual reports and fiscal truth.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid NFC-e keys are successfully decoded within 3 seconds (excluding SEFAZ latency).
- **SC-002**: Fiscal verified prices automatically reaching the "Golden Product" engine within 1 minute of reconciliation.
- **SC-003**: 0% manual entries override fiscal data once a "Fiscal Truth" flag is established.

## Assumptions

- We assume access to a reliable Brazilian SEFAZ proxy or direct access via API.
- We assume most receipts contain valid EAN-13 barcodes for product matching.
