# 05-Shopping Lists & Integrations: The "Pre-Shop" Preparation

## 1. The "List-to-Cart" Workflow
The goal is to allow users to build a list *before* they even arrive at the store.

## 2. Internal Shopping List Management
- **List Entity**: `id`, `name`, `user_id`, `family_id` (Shared Lists).
- **List Items**: `id`, `name` (Fuzzy), `global_product_id` (Optional linkage), `quantity`, `is_checked`.

## 3. External Integrations (The "Bridge")

### 3.1 Voice Assistants (Alexa, Google, Siri)
We utilize **Webhooks + OAuth2** to sync external lists:
1.  **Alexa Skills**: "Alexa, add bread to my Grocery Store list".
    *   *Backend*: Receives a webhook from Amazon with the string "bread".
    *   *System*: Fuzzy matches "bread" to the most likely `CanonicalProduct` and adds it to the user's active list.
2.  **Siri/Apple Reminders**: Integration via the iOS app's background sync (Reminders API).

## 4. The "Intelligent Sort" Logic
When a user starts a Shopping Event with a pre-built list, the system:
1.  Check the selected `Market` layout (if known) or historical data.
2.  **Sort the list by Aisle/Category** (e.g., Produce -> Bakery -> Dairy -> Frozen).
3.  Highlight "Cheaper elsewhere" if a nearby market has a verified price significantly lower for an item on the list.

## 5. Architectural Scars (Retail Nexus Veteran Advice)
*   **The "Vague Request"**: Users say "Milk" but not which milk (Whole, Skim, 1L, 2L).
    *   *Solution*: Lists are "Lazy Linked". The list item is just text until it's scanned in the store, at which point it's "resolved" to a `GlobalProduct`.
*   **Conflict Resolution**: Two family members editing the same list simultaneously.
    *   *Solution*: Use **CRDTs (Conflict-free Replicated Data Types)** or a simpler "Last-Win" at the item level with a strict `updated_at` check.

---
**Status**: DRAFT - *Solutions Architect / Retail Nexus Veteran*
