<!-- Synced from Cowork | 2026-02-18 03:30 -->

## Core Principles
- **Fast, minimal, attention-holding** — inspired by CarGurus (deal badges, interactive hero), Figma (color), Financial Times (info hierarchy)
- Dense with lots of information visible — like Google Shopping grid but cleaner
- Light mode only in v1 (no dark mode)
- Use design tokens from design-tokens.json for ALL colors, spacing, and typography

## Technology
- Components built with shadcn/ui primitives, customized with our tokens
- Animations via Framer Motion. Entrances: fade + slight translateY. Duration: 200-300ms
- Mobile-first responsive design. Breakpoints: sm(640) md(768) lg(1024) xl(1280)

## Typography
- **Inter** for all headings, body text, navigation, and UI labels
- **JetBrains Mono** for prices, specs, model numbers, and technical data
- Primary color: warm violet #7C3AED

## Layout
- **Homepage:** CarGurus-style interactive hero selector → Top Deals grid → Budget Picks → Best Rated
- **Category pages:** Filter sidebar (left, 280px) + laptop card grid (right) + sort controls (top bar)
- **Detail page:** Hero image + specs table + retailer price comparison rows + review summary
- **All pages:** Persistent header with logo, category nav tabs, and search bar (top right)

## Laptop Cards
- Show key info at a glance: image, name, key specs, top 3 lowest prices with retailer names
- Deal rating badge (Great Price green / Fair Price amber / Above Average red)
- "View Details" primary button + Compare checkbox
- Discount badge shows "X% off" in corner
- 2-line name truncation with ellipsis, full name on detail page
- Image fallback: generic laptop silhouette SVG with brand name

## Filter Sidebar
- Collapsible on mobile (slide-in drawer), always visible on desktop
- Filter sections: Brand, Processor (brand + specific model), Graphics (brand + specific model), RAM, Storage, Screen Size, Display Type, Resolution, Refresh Rate, Battery Life, Weight, Touchscreen, OS
- Only show filter values that have matching laptops (no dead-end filters)
- Each filter value shows count of matching laptops

## Price Display
- Always use JetBrains Mono for prices
- Lowest price highlighted with primary color
- Other prices in neutral-600
- "Price checked X minutes ago" freshness indicator
- Stale prices (>2 hours) get subtle warning badge

## Comparison Tray
- Sticky bottom bar, slides up when ≥1 laptop selected
- "Compare (X of 3)" counter, "Compare Now" button, "Clear all" link
- Preserves state in URL params across page navigation
- Max 3 laptops for comparison

## Interactive States
- Every interactive element needs: hover state, focus ring, active state, disabled state
- Cards: subtle lift shadow on hover
- Buttons: primary uses violet-600, hover violet-700
- **WCAG note:** primary.500 (#8b5cf6) fails AA contrast on white (4.07:1). Use primary.600 (#7c3aed) or darker for ALL text and interactive elements on light backgrounds. primary.500 is only safe on dark backgrounds or as a non-text decorative color.
- Links: underline on hover

## Loading & Error States
- Every page needs a loading skeleton, error state, and empty state
- Loading: 6 skeleton cards matching grid layout (not a spinner)
- Empty: Friendly message + "Clear all filters" button
- Error: "Something went wrong. We're on it — try refreshing in a moment."

## Accessibility
- Semantic HTML elements. All images need alt text
- Color contrast must meet WCAG AA (4.5:1 for text, 3:1 for large text)
- Keyboard navigable — all interactive elements reachable via Tab
- Screen reader labels on icon-only buttons

## API Integration
- All API routes MUST use withErrorHandler from src/lib/api-error.ts
- All request bodies MUST be validated with validateBody from src/lib/validate.ts
- All pages MUST have error.tsx, loading.tsx, and handle empty states
- Use ApiError static methods (notFound, unauthorized, forbidden) for typed errors
- No generic placeholder content. All copy comes from copy.md
