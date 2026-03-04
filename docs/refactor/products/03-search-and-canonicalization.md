## 2. Grouping Logic: The "Seasonality" vs "Size" Distinction

### 2.1 Equivalent EANs (Seasonal/Promotional)
Many products change barcodes for seasonal campaigns (Christmas, Father's Day, etc.) but remain the same physical product and price point.
- **Rule**: Multiple `Physical EANs` map to a single `Product Identity`.
- **User Impact**: Scanning a "Christmas Edition" can shows the same price and history as the "Normal" can.

### 2.2 Product Identities (Size/Format Variants)
A 330ml can vs a 2L bottle are **different** `Product Identities`.
- **Rule**: They share a `Canonical Product` parent but have separate `Market Prices`.

## 3. Search Flow (UX/Algorithm)

### 3.1 By EAN (Barcode Scanner)
1.  **Direct Resolution**: EAN -> `Product Identity`. 
2.  **Price Check**: Fetch the `Market Price` for that specific `Product Identity`.

### 3.2 By Name (Text Search)
1.  **Match Canonical**: "Coca-Cola" -> Returns the `Canonical Product`.
2.  **Show Identities**: Display the list of `Product Identities` (330ml, 600ml, 2L) under that Canonical parent.

### 3.2 By Name (Text Search)
- **Search Query**: "Cheetos"
- **Internal Logic**:
  1. Search `CanonicalProducts` (Primary results).
  2. Search `GlobalProducts` (Secondary results, shown inside groups).
- **Result UI**: Shows "Cheetos" with a "Choose Size/Format" dropdown or grid.

## 4. The "Market-Specific Search"
When a user is *inside* a Market location, the search prioritizes:
1. Products already reported in *that* specific market.
2. Products reported in *nearby* markets.
3. Global products never seen in the area.

## 5. Architectural Scars (Retail Nexus Veteran Advice)
*   **The "Multipack" Nightmare**: A single can has one EAN. A 6-pack has another. A 24-pack has a third.
    *   *Solution*: Our `GlobalProduct` MUST have a `PackQuantity` field. Price comparisons MUST be normalized to a "Unit Price" (e.g., Price per 100ml or per Liter).
*   **Regional EANs**: The same product might have different EANs in different countries or even regions. 
    *   *Solution*: Our `GlobalProduct` supports an array of `AliasEANs`.

---
**Status**: DRAFT - *Solutions Architect / Retail Nexus Veteran*
