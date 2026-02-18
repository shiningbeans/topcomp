import { z } from 'zod'
import { ApiError } from './api-error'

export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    throw ApiError.badRequest('Invalid JSON body')
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    const message = result.error.issues
      .map((issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ')
    throw ApiError.badRequest(`Validation failed: ${message}`)
  }
  return result.data
}

export function validateQuery<T>(
  params: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const obj: Record<string, string> = {}
  params.forEach((value, key) => {
    obj[key] = value
  })

  const result = schema.safeParse(obj)
  if (!result.success) {
    const message = result.error.issues
      .map((issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ')
    throw ApiError.badRequest(`Invalid query params: ${message}`)
  }
  return result.data
}

// Common reusable schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
})
