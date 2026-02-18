import { describe, it, expect, vi } from 'vitest';
import { ApiError, withErrorHandler } from '@/lib/api-error';
import { NextRequest, NextResponse } from 'next/server';

describe('ApiError', () => {
  it('creates error with correct properties', () => {
    const error = new ApiError('VALIDATION_ERROR', 'Test message', { field: 'test' }, 422);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.message).toBe('Test message');
    expect(error.details).toEqual({ field: 'test' });
    expect(error.status).toBe(422);
  });

  it('static methods create correct errors', () => {
    const notFound = ApiError.notFound();
    expect(notFound.status).toBe(404);
    expect(notFound.code).toBe('NOT_FOUND');

    const validation = ApiError.validation();
    expect(validation.status).toBe(422);
    expect(validation.code).toBe('VALIDATION_ERROR');
  });

  describe('withErrorHandler', () => {
    it('returns JSON response for ApiError', async () => {
      const handler = withErrorHandler(async () => {
        throw new ApiError('VALIDATION_ERROR', 'Validation failed', undefined, 422);
      });

      const req = new NextRequest('http://localhost');
      const res = await handler(req);
      const json = await res.json();

      expect(res.status).toBe(422);
      expect(json).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
        },
      });
    });

    it('returns 500 for unknown errors', async () => {
      const handler = withErrorHandler(async () => {
        throw new Error('Boom');
      });

      const req = new NextRequest('http://localhost');
      const res = await handler(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error.code).toBe('INTERNAL_ERROR');
    });
  });
});
