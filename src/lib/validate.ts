import { z } from 'zod';
import { ApiError } from './api-error';

export async function validateBody<T>(req: Request, schema: z.ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch (error) {
    throw ApiError.validation('Invalid JSON body');
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw ApiError.validation('Validation failed', { issues: result.error.issues });
  }

  return result.data;
}

export function validateQuery<T>(req: Request, schema: z.ZodSchema<T>): T {
  const { searchParams } = new URL(req.url);
  const obj: Record<string, string | string[]> = {};

  // Handle multiple values for same key (e.g. ?brand=A&brand=B) if needed, 
  // but mostly we use comma separated. 
  // For now simple object conversion.
  for (const [key, value] of searchParams.entries()) {
    obj[key] = value;
  }

  const result = schema.safeParse(obj);
  if (!result.success) {
    throw ApiError.validation('Invalid query parameters', { issues: result.error.issues });
  }

  return result.data;
}
