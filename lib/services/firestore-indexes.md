# Firestore Indexes Required for Production

## Composite Indexes

Add these indexes in the Firebase Console → Firestore → Indexes tab:

### 1. Featured Products Query
**Collection:** `products`  
**Query:** `where('featured', '==', true)` + `orderBy('name')`  
**Fields:**
- `featured` (Ascending)
- `name` (Ascending)

### 2. Products by Brand (for filtering)
**Collection:** `products`  
**Query:** `where('brand', '==', <brand>)` + `orderBy('name')`  
**Fields:**
- `brand` (Ascending)
- `name` (Ascending)

### 3. Products by Category (for filtering)
**Collection:** `products`  
**Query:** `where('category', '==', <category>)` + `orderBy('name')`  
**Fields:**
- `category` (Ascending)
- `name` (Ascending)

### 4. Products with Price Ordering
**Collection:** `products`  
**Query:** `orderBy('price')`  
**Fields:**
- `price` (Ascending)

### 5. Products by Featured + Price (for featured sorting by price)
**Collection:** `products`  
**Query:** `where('featured', '==', true)` + `orderBy('price')`  
**Fields:**
- `featured` (Ascending)
- `price` (Ascending)

### 6. Products by Date Created (for newest)
**Collection:** `products`  
**Query:** `orderBy('createdAt')`  
**Fields:**
- `createdAt` (Descending) ⚠️ Must be Descending

### 7. Active Products with Order (for banners, categories)
**Collection:** `products` / `banners` / `categories`  
**Query:** `where('active', '==', true)` + `orderBy('order')`  
**Fields:**
- `active` (Ascending)
- `order` (Ascending)

### 8. Daily Deals with Product Join
**Collection:** `dailyDeals` + `products` (collection group)  
**Note:** This requires application-level join. Consider denormalizing `productName` and `productImage` into `dailyDeals` for faster queries.

---

## Single-Field Indexes (Usually Auto-Created)

These are often auto-created, but verify in console:

- `products` → `name` (Ascending)
- `products` → `brand` (Ascending)
- `products` → `category` (Ascending)
- `products` → `price` (Ascending)
- `products` → `createdAt` (Descending)
- `products` → `active` (Ascending)
- `banners` → `placement` (Ascending)
- `banners` → `order` (Ascending)
- `categories` → `order` (Ascending)
- `brands` → `name` (Ascending)

---

## How to Deploy Indexes

### Option A: Firebase Console (Manual)
1. Go to Firebase Console → Firestore → Indexes
2. Click "Create Index"
3. Select collection and add field pairs
4. Wait for "Building" → "Enabled" (can take minutes to hours)

### Option B: `firestore.indexes.json` (Recommended)
Create this file in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "featured", "order": "ASCENDING" },
        { "fieldPath": "name", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "brand", "order": "ASCENDING" },
        { "fieldPath": "name", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "name", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "price", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "featured", "order": "ASCENDING" },
        { "fieldPath": "price", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "active", "order": "ASCENDING" },
        { "fieldPath": "order", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Deploy with:
```bash
firebase deploy --only firestore:indexes
```

---

## Monitor Index Usage

In Firebase Console → Firestore → Usage, check:
- **Index build errors** → indicates missing indexes
- **Query cost** → if high, queries may be doing collection scans

---

## Expected Read Cost Reduction

**Before:** `getDocs()` with no limit = reads **entire collection** (e.g., 10k products = 10k reads per query)

**After:** `limit(24)` + pagination = **24 reads per page request** (99.76% reduction)

---

**⚠️ Action Required:** Create these indexes before deploying pagination changes, otherwise queries will fail.
