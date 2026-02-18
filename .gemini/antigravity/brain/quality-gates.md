<!-- Synced from Cowork | 2026-02-18 04:38 -->

# Quality Gates

Every file you create or modify must pass these gates before you consider it done.
These rules are non-negotiable. If your code violates any gate, fix it before moving on.

---

## 1. TypeScript Strictness

- **Zero `any` types.** Never use `any`, `as any`, or `any[]`. Use generics, `unknown`, Prisma's generated types, or explicit interfaces instead.
- **Zero `@ts-ignore` / `@ts-expect-error`.** If the type system complains, fix the type — don't suppress it.
- **All function parameters and return types must be inferable or explicit.** No implicit `any` from missing types.

```typescript
// BAD
const format = (items: any[], key: string) => ...
dealRating: laptop.dealRating as any

// GOOD
const format = <T extends Record<string, unknown>>(items: T[], key: keyof T & string) => ...
dealRating: laptop.dealRating  // Prisma type matches directly
```

---

## 2. Images — Always next/image

- **Never use raw `<img>` tags.** Always use `import Image from 'next/image'`.
- Set explicit `width` and `height` props (or use `fill` with a sized parent).
- Add `priority` on above-the-fold hero images.
- All external image domains are already allowed via `remotePatterns` in `next.config.ts`.

```tsx
// BAD
<img src={laptop.imageUrl} alt={laptop.name} className="..." />

// GOOD
<Image src={laptop.imageUrl} alt={laptop.name} width={200} height={200} className="..." />
```

---

## 3. Console Statements

- **Zero `console.log` / `console.warn` / `console.info` in production code.** Delete them.
- **`console.error` is allowed ONLY inside cron routes**, guarded by environment:
  ```typescript
  if (process.env.NODE_ENV === 'development') {
    console.error('Cron error:', error)
  }
  ```
- **Error boundaries (`error.tsx`):** Do not log to console. Leave a TODO comment for error reporting:
  ```typescript
  // TODO: Send to error reporting service (e.g., Sentry)
  ```

---

## 4. Route State Coverage

Every route directory under `src/app/` that renders a page must contain all three state files:

| File | Purpose |
|------|---------|
| `page.tsx` | Main page content |
| `loading.tsx` | Suspense fallback skeleton shown during page load |
| `error.tsx` | Error boundary with retry button |

If the route has dynamic data, also consider `not-found.tsx`.

**Use existing patterns.** Copy the `loading.tsx` from `/work` for other category pages. Copy the `error.tsx` pattern from any existing error boundary.

---

## 5. SEO & Metadata

Every `page.tsx` must export metadata:

**Static pages:**
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for search engines and social sharing.',
  openGraph: {
    title: 'Page Title | TopComp',
    description: 'Page description.',
  },
}
```

**Dynamic pages (e.g., `/laptop/[slug]`):**
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const laptop = await prisma.laptop.findUnique({ where: { slug: params.slug } })
  if (!laptop) return { title: 'Not Found' }
  return {
    title: laptop.name,
    description: `Compare prices for ${laptop.name} across 16+ retailers.`,
    openGraph: {
      title: `${laptop.name} | TopComp`,
      description: `Compare prices for ${laptop.name}.`,
      images: laptop.imageUrl ? [{ url: laptop.imageUrl }] : [],
    },
  }
}
```

The root `layout.tsx` defines default metadata with `title.template: '%s | TopComp'`. Page-level exports override it.

**Required site-level files** (already created — do not delete):
- `public/robots.txt`
- `src/app/sitemap.ts`

---

## 6. Accessibility (a11y)

- **Every interactive element** (`<button>`, `<a>`, `<select>`, `<input>`) must have an `aria-label` unless its text content already describes its purpose.
- **Icon-only buttons** always need `aria-label`:
  ```tsx
  <button aria-label="Remove from comparison">
    <XIcon />
  </button>
  ```
- **Use semantic HTML:** `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`. Do not use `<div>` where a semantic element fits.
- **List patterns:** Use `<ul role="list">` with `<li>` for card grids. Add `aria-label` on the list describing its content.
- **Skeletons / loading states:** Add `role="status"` and `aria-label="Loading"`.
- **Tables:** Add `aria-label` describing what the table shows.

---

## 7. Color Contrast (WCAG AA)

Refer to the design tokens in `design-tokens.json` and the WCAG note in `ui-rules.md`:

- **primary.500 (#8b5cf6) fails AA on white** (4.07:1). Do NOT use it for text or interactive elements on light backgrounds.
- **Use primary.600 (#7c3aed) or darker** for all text and interactive elements on light backgrounds.
- Minimum contrast ratios: **4.5:1** for normal text, **3:1** for large text (18px+ or 14px+ bold).

---

## 8. Security Headers

Every API route must:
- Validate all input with Zod (import schemas from `src/lib/validators/`)
- Use the centralized error handler from `src/lib/api-error.ts`
- Never expose stack traces or internal error messages to clients
- Return structured JSON errors: `{ error: string, status: number }`

---

## 9. Dependencies

- **No `devDependencies` in production bundles.** Test/build tools stay in devDependencies.
- **Check for `next/image`, `next/link`, `next/font`** — always use Next.js optimized versions instead of raw HTML equivalents.
- **No unused imports.** The build will tree-shake, but clean code is easier to maintain.

---

## 10. Performance

- Use `next/image` for all images (see Gate 2).
- Use `next/link` for all internal navigation — never raw `<a href>` for internal routes.
- Use `next/font` for font loading (already configured in layout.tsx).
- Consider `React.lazy` / `next/dynamic` for heavy components not needed on initial load (e.g., comparison tray content).
- Avoid `useEffect` for data that can be fetched server-side. Prefer server components.

---

## Pre-Commit Checklist

Before declaring any task complete, mentally run through:

- [ ] Zero `any` types
- [ ] Zero raw `<img>` tags
- [ ] Zero unguarded `console.*` statements
- [ ] All routes have `page.tsx` + `loading.tsx` + `error.tsx`
- [ ] All pages export metadata with openGraph
- [ ] All interactive elements have aria-labels
- [ ] Text colors meet WCAG AA contrast on their backgrounds
- [ ] All inputs validated with Zod
- [ ] No raw `<a>` for internal links — use `next/link`
- [ ] Build passes: `npm run build` with zero errors
