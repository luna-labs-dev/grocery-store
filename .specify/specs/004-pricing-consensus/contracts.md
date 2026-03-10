# API Contracts: Pricing Truth Consensus Engine

## 🏢 Pricing Intelligence

### Price Submission
- **POST** `/api/products/report`: Report a price.
  - **Payload**: `{ean, marketId, price, isPromotion}`.
  - **Response**: `200 OK` with `{reportId, status: "pending" | "outlier"}`.

### Consensus Status
- **GET** `/api/products/:ean/prices/:marketId`: Get current verified price and history.
  - **Response**: `{price, status: "verified" | "unverified", history: [...]}`.

## ⚡ Real-Time Events
- `price:verified`: Emitted when a report matches consensus. payload: `{ean, marketId, newPrice}`.
- `report:flagged`: Emitted if a user's report is marked as an outlier.
