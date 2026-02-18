<!-- Synced from Cowork | 2026-02-18 03:30 -->

## Problem

Finding the true lowest price on a specific laptop configuration is broken. Google Shopping mixes in ads and misses deals, spec filtering is unreliable across retailers, and users end up manually checking 5-10 retailer tabs. No single source reliably surfaces the best price for a specific config.

## Target User

Tech-savvy deal hunters, college students on a budget, and small business owners buying 1-2 machines. They generally know what specs matter but the site should be approachable enough for less technical users to browse by category.

## Hook

Broader coverage than gaming-only sites (work, gaming, Apple), tracks more retailers than Google Shopping, and zero ads in results. Clean, honest price comparisons.

## v1 Scope

### P0 Features (Must Ship)

**1. Category Browsing**
Work, Gaming, Apple sections with persistent nav tabs.
Acceptance criteria:
- [ ] Three category tabs always visible in header nav
- [ ] Clicking a tab filters the listing to that category
- [ ] Active tab is visually highlighted
- [ ] URL updates to reflect selected category (e.g., `/work`, `/gaming`, `/apple`)

**2. Spec Filtering**
CPU, GPU (with specific model search like RTX 5080Ti), RAM, storage, screen size, resolution, refresh rate, weight, display type, battery life, touchscreen, OS. Left sidebar layout.
Acceptance criteria:
- [ ] Filter sidebar renders on left with all spec categories
- [ ] Selecting a filter value immediately updates the laptop grid
- [ ] Only filter values with matching laptops are shown (no dead-end filters)
- [ ] Each filter value displays a count of matching laptops
- [ ] Filters persist in URL params for shareability
- [ ] Mobile: sidebar collapses into a slide-in drawer

**3. Brand Filtering**
Dell, Lenovo, HP, ASUS, Acer, MSI, Apple, Razer, Samsung, LG, etc.
Acceptance criteria:
- [ ] Brand filter section in sidebar with checkbox per brand
- [ ] Multiple brands can be selected simultaneously
- [ ] Brand selection combines with spec filters

**4. Sorting**
Price low-to-high, high-to-low, biggest discount %, best reviewed, newest.
Acceptance criteria:
- [ ] Sort dropdown appears above the laptop grid
- [ ] Changing sort re-orders results without full page reload
- [ ] Default sort is price low-to-high
- [ ] Sort choice persists in URL params

**5. Search Bar**
Always visible top right. Text search by name, model number, keyword, or minimum spec requirements. Typeahead suggestions.
Acceptance criteria:
- [ ] Search input always visible in the header
- [ ] Typing 2+ characters triggers typeahead dropdown with suggestions
- [ ] Suggestions grouped by type: laptop name, brand, spec
- [ ] Pressing Enter or clicking a suggestion navigates to results
- [ ] Search results page uses the same card grid layout

**6. Laptop Card Display**
Key specs, image, top 3 lowest prices with retailer names, deal rating badge (Great Price / Fair Price / Above Average — CarGurus-inspired).
Acceptance criteria:
- [ ] Card shows: image, name (2-line truncation), key specs (CPU, RAM, storage, screen), top 3 prices with retailer names
- [ ] Deal rating badge rendered with correct color (green/amber/red)
- [ ] Discount percentage badge shown when applicable
- [ ] "View Details" button links to detail page
- [ ] Compare checkbox adds laptop to comparison tray
- [ ] Image fallback to generic silhouette SVG if image fails

**7. Laptop Detail Page**
Full specs, price from each tracked retailer with "Buy at [Retailer] — $[price]" rows, external review score, buy links.
Acceptance criteria:
- [ ] All spec fields displayed in a structured table
- [ ] Every tracked retailer's price shown as a clickable row
- [ ] "Price checked X minutes ago" freshness indicator per retailer
- [ ] Stale prices (>2 hours) show warning badge
- [ ] Review score displayed if available
- [ ] Out-of-stock retailers shown as "Currently unavailable"
- [ ] Buy links open retailer page in new tab (affiliate links)

### P1 Features (Should Ship)

**8. Price Range Filter**
Min/max slider for price filtering.
Acceptance criteria:
- [ ] Dual-handle range slider in filter sidebar
- [ ] Min and max update URL params and filter results
- [ ] Slider range dynamically reflects actual price range in current category

**9. Top Deals Section**
Ranked by price drop percentage.
Acceptance criteria:
- [ ] Dedicated section on homepage and as a nav link
- [ ] Laptops sorted by discount percentage descending
- [ ] Discount badge prominently displayed on each card

**10. Budget Friendly Section**
Best specs-to-price ratio picks.
Acceptance criteria:
- [ ] Algorithm weights RAM, storage, CPU scores against price
- [ ] Section accessible from homepage and nav
- [ ] Optional max price cap filter

**11. Best Laptops Section**
Aggregated review scores from external sources.
Acceptance criteria:
- [ ] Laptops sorted by review score descending
- [ ] Minimum review score threshold (default 70/100)
- [ ] Review count shown alongside score

**12. Side-by-Side Comparison**
Compare checkbox on cards, sticky bottom tray "Compare (2 of 3)", up to 3 laptops, "Compare Now" button, "Clear all".
Acceptance criteria:
- [ ] Compare checkbox on every laptop card
- [ ] Sticky bottom tray appears when ≥1 laptop selected
- [ ] Tray shows "Compare (X of 3)" counter
- [ ] "Compare Now" enabled when ≥2 selected, disabled otherwise
- [ ] Comparison page shows specs side-by-side in a table
- [ ] State preserved in URL params across navigation
- [ ] Maximum 3 laptops; additional checkboxes disabled at limit

### Excluded from v1

- User accounts / login / sign-up
- Price drop alerts / notifications
- Native mobile app
- Desktop PCs (laptops only in v1)

## Data Pipeline

- **Refresh cycle:** Every 30 minutes via Vercel cron
- **16 retailer sources in 3 tiers:**
  - API (4): Amazon PA-API, Best Buy API, Walmart Affiliate API, eBay Browse API
  - Scraped — Major retailers (4): Newegg, B&H Photo, Micro Center, Adorama
  - Scraped — Manufacturer stores (4): Lenovo.com, Dell.com, HP.com, Apple.com
  - Scraped — Warehouse/general (4): Costco, Sam's Club, Target, Office Depot/Staples
- **Spec normalization:** Gemini API normalizes scraped product names and specs into structured fields
- **Image hosting:** Vercel Blob
- **Deal rating logic:** Compare laptop's lowest price to median across all retailers. Great Price = ≥15% below median (green), Fair Price = within 15% (amber), Above Average = >15% above (red)

## Non-Functional Requirements

- WCAG AA accessibility compliance
- Page load time < 3 seconds (< 2s target)
- Responsive design: mobile, tablet, desktop
- Supports latest 2 versions of Chrome, Firefox, Safari, Edge
- Price data freshness < 30 minutes

## Success Metrics

| Metric | Target |
|---|---|
| Page load time | < 2 seconds |
| Price data freshness | < 30 minutes |
| Laptop coverage at launch | 500+ configurations |
| Retailers tracked | 16 sources |
| Uptime | 99.5% |
| API response time (p95) | < 500ms |
