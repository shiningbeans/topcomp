# Agent Rules

## Planning Required
- DO NOT write code without generating a plan artifact first
- For every complex task, create artifacts/plan_[task].md before touching src/
- Use <thought> blocks before making architectural decisions

## Code Quality
- TypeScript strict mode is ON. No `any` types. No `@ts-ignore` or `@ts-nocheck`
- Every function must have explicit return types
- Every component must handle: loading, error, empty, and success states
- No hardcoded colors, spacing, or font sizes — use design tokens from .gemini/antigravity/brain/design-tokens.json
- All user-facing copy must come from .gemini/antigravity/brain/copy.md. No lorem ipsum. No placeholder text.
- BEFORE building any component, study src/components/shared/feature-card.tsx — it is the reference implementation showing the exact patterns you must follow (4 states, design tokens, Framer Motion, a11y, testing)
- All components MUST work in both light and dark mode. Use the surface.light and surface.dark token sets via CSS variables.

## Security
- NEVER commit .env files, API keys, tokens, or secrets to source
- All API route handlers MUST be wrapped with withErrorHandler from src/lib/api-error.ts
- All request bodies MUST be validated with validateBody from src/lib/validate.ts using Zod schemas
- Use parameterized queries for all database operations. No string concatenation for SQL
- CSP headers are configured in middleware.ts — do not weaken them

## API Patterns
- Follow the error response format defined in .gemini/antigravity/brain/api-contract.md
- Use ApiError static methods: ApiError.notFound(), ApiError.unauthorized(), ApiError.forbidden()
- Return appropriate HTTP status codes (201 for creation, 204 for deletion, 422 for validation)

## Testing
- Use Vitest for unit and integration tests. Test files go in src/__tests__/ or colocated as *.test.ts(x)
- Use Playwright for E2E tests. Test files go in e2e/
- Every API route needs at least one happy-path and one error-path test (Vitest)
- Every form component needs a validation test (Vitest + Testing Library)
- Every critical user flow needs an E2E test (Playwright)
- Run `npm test` after implementing any feature — all tests must pass before moving on
- Save test output to artifacts/logs/ as evidence
- When writing Playwright tests, always test both desktop and mobile viewports

## Files You Must Not Touch Without Permission
- middleware.ts (security headers)
- src/lib/api-error.ts (error handling infrastructure)
- src/lib/validate.ts (validation infrastructure)
- src/lib/auth.ts (authentication)
- Any file in .gemini/antigravity/brain/ (Cowork manages these)
- .env, .env.local, .env.production (secrets)
