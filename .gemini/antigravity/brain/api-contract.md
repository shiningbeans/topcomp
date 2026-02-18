<!-- Synced from Cowork | 2026-02-18 03:30 -->

## Overview

## Standard Error Format
All API errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

Error codes: `VALIDATION_ERROR`, `NOT_FOUND`, `RATE_LIMITED`, `INTERNAL_ERROR`

## Rate Limiting
100 requests/minute per IP via Vercel edge middleware. Returns 429 with `Retry-After` header.

## Caching
- List endpoints (`/api/laptops`, `/api/deals`, etc.): `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`
- Detail pages (`/api/laptops/[slug]`): `Cache-Control: public, s-maxage=30, stale-while-revalidate=60`
- Filter/suggestion endpoints: `Cache-Control: public, s-maxage=300`

## Endpoints

### GET /api/laptops
List and filter laptops. The main workhorse endpoint.

Query params:
- `category`: WORK | GAMING | APPLE
- `brand`: string (comma-separated for multiple, e.g., "Lenovo,HP,Dell")
- `minPrice`, `maxPrice`: number (USD)
- `minRam`, `maxRam`: number (GB)
- `minStorage`, `maxStorage`: number (GB)
- `gpuBrand`: string (comma-separated, e.g., "NVIDIA,AMD")
- `gpuModel`: string (comma-separated, e.g., "RTX 4070,RTX 4080")
- `cpuBrand`: string (comma-separated, e.g., "Intel,AMD,Apple")
- `cpuModel`: string (comma-separated, e.g., "Core i7-13700H,M3 Pro")
- `screenSize`: string (comma-separated, e.g., "13,14,15,16,17")
- `displayType`: string (comma-separated, e.g., "IPS,OLED")
- `touchscreen`: boolean
- `os`: string (comma-separated, e.g., "Windows,macOS,ChromeOS")
- `dealRating`: GREAT | FAIR | ABOVE_AVERAGE
- `sortBy`: price | discount | reviewScore | newest (default: price)
- `order`: asc | desc (default: asc)
- `page`: number (default 1)
- `limit`: number (default 20, max 100)
- `q`: string (full-text search by name, model, keyword)

Response:
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Lenovo ThinkPad X1 Carbon Gen 11",
      "slug": "lenovo-thinkpad-x1-carbon-gen-11",
      "brand": "Lenovo",
      "model": "21HM...",
      "category": "WORK",
      "imageUrl": "https://...",
      "cpu": "Intel Core i7-1365U",
      "cpuBrand": "Intel",
      "cpuModel": "Core i7-1365U",
      "gpu": "Intel Iris Xe",
      "gpuBrand": "Intel",
      "ramGb": 16,
      "storageGb": 512,
      "storageType": "SSD",
      "screenSize": 14.0,
      "screenRes": "2560x1600",
      "displayType": "IPS",
      "refreshRate": 60,
      "weightLbs": 2.48,
      "batteryHours": 15.0,
      "touchscreen": false,
      "os": "Windows",
      "reviewScore": 88.5,
      "reviewCount": 142,
      "dealRating": "GREAT",
      "lowestPrice": 1149.99,
      "lowestRetailer": "Amazon",
      "prices": [
        { "retailer": "Amazon", "price": 1149.99, "inStock": true },
        { "retailer": "Best Buy", "price": 1199.99, "inStock": true },
        { "retailer": "Newegg", "price": 1179.00, "inStock": true }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

Note: `prices` on list response includes only top 3 lowest-priced retailers. Full price list on detail endpoint.

### GET /api/laptops/[slug]
Get full laptop details with ALL retailer prices.

Response:
```json
{
  "data": {
    "...all laptop fields from list response",
    "ramType": "DDR5",
    "storageInterface": "NVMe",
    "reviewSummary": "Excellent ultrabook with great battery...",
    "releaseDate": "2024-03-15T00:00:00Z",
    "prices": [
      {
        "retailer": "Amazon",
        "price": 1149.99,
        "originalPrice": 1399.99,
        "discountPct": 17.9,
        "retailerUrl": "https://amazon.com/dp/...",
        "inStock": true,
        "lastChecked": "2026-02-18T12:30:00Z"
      },
      { "...more retailers" }
    ]
  }
}
```

### GET /api/deals
Top deals sorted by discount percentage.

Query params:
- `category`: optional filter
- `limit`: number (default 20, max 50)

Response: Same shape as `/api/laptops` but pre-sorted by `discountPct` desc.

### GET /api/budget-picks
Best value laptops (specs-to-price ratio). Algorithm weights RAM, storage, CPU benchmark scores against price.

Query params:
- `category`: optional filter
- `maxPrice`: number (optional cap)
- `limit`: number (default 20, max 50)

### GET /api/best-rated
Highest-reviewed laptops.

Query params:
- `category`: optional filter
- `minReviewScore`: number 0-100 (default 70)
- `limit`: number (default 20, max 50)

### GET /api/filters
Get available filter values — used to populate filter sidebar dynamically. Only returns values that have matching laptops (no dead-end filters).

Response:
```json
{
  "data": {
    "brands": [{ "value": "Lenovo", "count": 45 }, { "value": "Dell", "count": 38 }],
    "cpuBrands": [{ "value": "Intel", "count": 120 }, { "value": "AMD", "count": 65 }],
    "cpuModels": [{ "value": "Core i7-13700H", "count": 22 }],
    "gpuBrands": [{ "value": "NVIDIA", "count": 90 }],
    "gpuModels": [{ "value": "RTX 4070", "count": 18 }],
    "screenSizes": [13, 14, 15.6, 16, 17.3],
    "displayTypes": ["IPS", "OLED", "TN", "Mini-LED"],
    "ramOptions": [8, 16, 32, 64],
    "storageOptions": [256, 512, 1024, 2048],
    "osOptions": ["Windows", "macOS", "ChromeOS"],
    "priceRange": { "min": 299, "max": 4999 },
    "categories": ["WORK", "GAMING", "APPLE"]
  }
}
```

### GET /api/search/suggestions
Typeahead autocomplete for the search bar.

Query params:
- `q`: string (minimum 2 characters)
- `limit`: number (default 8, max 15)

Response:
```json
{
  "data": [
    { "type": "laptop", "text": "MacBook Pro 14\" M3 Pro", "slug": "macbook-pro-14-m3-pro" },
    { "type": "brand", "text": "Apple", "url": "/apple" },
    { "type": "spec", "text": "RTX 4070 laptops", "url": "/gaming?gpuModel=RTX+4070" }
  ]
}
```

### POST /api/cron/refresh-prices
**Protected:** Requires `Authorization: Bearer ${CRON_SECRET}` header.

Triggered by Vercel cron every 30 minutes. Fetches latest prices from all retailer adapters, normalizes specs, upserts laptops and prices, records price history.

Response: `{ "status": "ok", "retailers": { "amazon": { "updated": 120, "errors": 2 }, "bestbuy": { "updated": 95, "errors": 0 } } }`

### POST /api/cron/compute-deals
**Protected:** Requires `Authorization: Bearer ${CRON_SECRET}` header.

Runs after price refresh. Recalculates `lowestPrice`, `lowestRetailer`, and `dealRating` on every laptop.

Response: `{ "status": "ok", "laptopsUpdated": 523 }`

## Retailer Adapter Interface
Each retailer implements this interface:
```typescript
interface RetailerAdapter {
  name: string                                          // "amazon", "bestbuy", etc.
  fetchProducts(category: Category): Promise<RawProduct[]>
  fetchPrice(productId: string): Promise<PriceData | null>
}

interface RawProduct {
  name: string
  brand: string
  model: string
  specs: Record<string, string>   // Raw spec strings, normalized by Gemini
  price: number
  originalPrice?: number
  url: string
  imageUrl?: string
  inStock: boolean
}
```

## Retailer Sources (16 total)

**API-based (4):**
- Amazon PA-API (1 req/sec, affiliate required)
- Best Buy API (5 req/sec, free developer key)
- Walmart Affiliate API (20 req/sec, 2-5 day approval)
- eBay Browse API (5000/day, developer program)

**Scraped — Major retailers (4):**
- Newegg, B&H Photo, Micro Center, Adorama (1 req/2sec each)

**Scraped — Manufacturer stores (4):**
- Lenovo.com, Dell.com, HP.com, Apple.com (1 req/2sec each)

**Scraped — Warehouse/general (4):**
- Costco, Sam's Club, Target, Office Depot/Staples (1 req/2sec each)

All scraped retailers go through Gemini API for spec normalization.
```
