# Feature Specification: Pricing Truth Consensus Engine

**Feature Branch**: `004-pricing-consensus`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "Implement Truth-based Pricing Consensus (5-User rule) with Outlier Detection for the Golden Product Engine"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crowdsourced Price Verification (Priority: P1)

As a shopper, I want the system to verify the prices I report so that I can trust the accuracy of the "Golden Product" data when I shop.

**Why this priority**: Core value of the "Golden Product" engine. Without verification, the crowdsourced data is prone to staleness and error.

**Independent Test**: Can be tested by submitting 5 reports for the same product at the same market from different high-reputation accounts and checking if the status flips to "Verified".

**Acceptance Scenarios**:

1. **Given** a product "Milk A" at "Market B" with 4 existing reports of $5.00 within the last 72 hours, **When** a 5th unique user reports $5.00, **Then** the product price should be marked as **Verified**.
2. **Given** 5 reports for "Milk A" but one is 5% different from the others, **When** the consensus logic runs, **Then** the status remains "Unverified" (outside 2% margin).

---

### User Story 2 - Outlier Detection & Anti-Troll Defense (Priority: P2)

As a system, I want to automatically flag and ignore "impossible" prices so that trolls cannot sabotage the data integrity.

**Why this priority**: Essential for security and data quality in a crowdsourced environment.

**Independent Test**: Mock reports from nearby markets and submit a report with >30% variance. Verify it is ignored for consensus.

**Acceptance Scenarios**:

1. **Given** an average price of $3.00 for "Soda C" in nearby markets, **When** a user reports $10.00 for the same soda, **Then** the report is flagged as an **Outlier** and excluded from the 5-user count.

---

### User Story 3 - User Reputation Weighting (Priority: P3)

As a shopper, I want my history of accurate reporting to increase the weight of my reports so that the system reaches consensus more reliably.

**Why this priority**: Rewards honest contributors and speeds up verification for high-trust sources.

**Independent Test**: Compare verification speed with high-reputation vs low-reputation accounts.

**Acceptance Scenarios**:

1. **Given** a high-reputation user, **When** they report a price, **Then** the system assigns a higher weight to their report calculation (though 5 unique users are still required for full verification).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST track "Price Reports" per (Product Identity, Market, User, Timestamp).
- **FR-002**: System MUST implement the **5-User Rule**: 5 unique users reporting within a 2% margin of each other marks the price as **Verified**.
- **FR-003**: System MUST enforce a **Consensus Window** of 72 hours. Reports older than this are ignored for active verification.
- **FR-004**: System MUST calculate an **Outlier Threshold**: Any report >30% different from the regional market average is flagged.
- **FR-005**: System MUST store verified price transitions in a `price_history` table.
- **FR-006**: System MUST support `is_on_promotion` flags to exclude temporary sales from base price history calculations.

### Key Entities

- **PriceReport**: Link between User, Market, and Product Identity.
- **MarketProductPrice**: The current "Golden" price per Market/Identity pair.
- **UserReputation**: Score derived from historical accuracy of reports.
- **PriceHistory**: Historical log of verified price changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of price reports are processed through the outlier filter within 500ms.
- **SC-002**: No unverified price is marked "Verified" without at least 5 unique user signatures.
- **SC-003**: System correctly identifies and ignores 100% of reports exceeding the 30% regional variance threshold in test suites.

## Assumptions

- We assume a "Regional Market Average" can be calculated from nearby stores (within 10km) or historical store data.
- We assume User Reputation starts at a baseline and increments with each verified report.
