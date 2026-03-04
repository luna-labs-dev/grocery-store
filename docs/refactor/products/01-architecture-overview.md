# 01-Architecture Overview: The "Golden Product" Ecosystem

## 1. The Problem Statement
In retail, a "Product" isn't just a name. It's a complex hierarchy of identifiers (GTIN/EAN), variants (Size, Flavor), and price points (Market-specific). Our current system treats products as ephemeral transaction logs. This refactor introduces the **Golden Product**—a canonical, deduplicated, and enriched record that serves as the source of truth for the entire ecosystem.

## 2. Entity Relationship Diagram

```mermaid
erDiagram
    CANONICAL_PRODUCT ||--o{ GLOBAL_PRODUCT : "groups"
    GLOBAL_PRODUCT ||--o{ MARKET_PRODUCT_PRICE : "priced_at"
    MARKET ||--o{ MARKET_PRODUCT_PRICE : "hosts"
    GLOBAL_PRODUCT ||--o{ PRICE_REPORT : "has"
    USER ||--o{ PRICE_REPORT : "reports"
    MARKET ||--o{ PRICE_REPORT : "at"
    SHOPPING_LIST ||--o{ LIST_ITEM : "contains"
    GLOBAL_PRODUCT ||--o{ LIST_ITEM : "targeted_as"
    SHOPPING_EVENT ||--o{ CART_ITEM : "contains"
    GLOBAL_PRODUCT ||--o{ CART_ITEM : "is_a"

    CANONICAL_PRODUCT {
        uuid id
        string name "e.g. Coca-Cola"
        string brand "Coca-Cola Company"
        string category "Soft Drinks"
    }

    GLOBAL_PRODUCT {
        uuid id
        string gtin_ean "Barcode (PK)"
        uuid canonical_id "FK"
        string name "e.g. Coca-Cola 350ml Can"
        string volume "350ml"
        string imageUrl
    }

    MARKET_PRODUCT_PRICE {
        uuid market_id
        uuid global_product_id
        decimal verified_price
        boolean is_verified
        int verification_count
        timestamp last_updated
    }
```

## 3. Core Concepts

### 3.1 The Canonical vs Global Distinction
- **Global Product**: A unique SKU identified by a barcode (EAN-13). *Example: Coca-Cola 350ml Can (EAN: 5449000000996)*.
- **Canonical Product (The "Search Group")**: A parent record that groups variants. *Example: "Coca-Cola"*. 
This allows us to answer: *"Where is Coca-Cola cheapest?"* by aggregating across all its EAN variants (Cans, 2L Bottles, etc.) or specifically filtering for the 350ml version.

### 3.2 Crowdsourced Price Consensus
We don't trust a single user report. We use a **N-Factor Consensus Model**.
- **Report**: Any time a user adds an item to a cart, we capture `(UserID, MarketID, EAN, ReportedPrice)`.
- **Verified Price**: When 5 unique users report the same price (+/- a small variance for inflation/promo) within a rolling 7-day window.

### 3.3 Offline-First Resilience
The frontend must be able to scan an EAN and add it to the cart even if the backend or External API is down.
- **Lazy Hydration**: Items added while offline are synced later. If the EAN is unknown, the user provides a temporary name/price, which the backend then attempts to "canonicalize" once online.

---
**Author**: Solutions Architect / Retail Nexus Veteran
**Status**: DRAFT
