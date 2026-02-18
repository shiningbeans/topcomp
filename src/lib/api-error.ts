import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';

export type ApiErrorCode = 'VALIDATION_ERROR' | 'NOT_FOUND' | 'RATE_LIMITED' | 'INTERNAL_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN';

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public details?: Record<string, unknown>,
    public status: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static notFound(message = 'Resource not found', details?: Record<string, unknown>) {
    return new ApiError('NOT_FOUND', message, details, 404);
  }

  static validation(message = 'Validation failed', details?: Record<string, unknown>) {
    return new ApiError('VALIDATION_ERROR', message, details, 422);
  }

  static unauthorized(message = 'Unauthorized', details?: Record<string, unknown>) {
    return new ApiError('UNAUTHORIZED', message, details, 401);
  }

  static forbidden(message = 'Forbidden', details?: Record<string, unknown>) {
    return new ApiError('FORBIDDEN', message, details, 403);
  }

  static internal(message = 'Internal server error', details?: Record<string, unknown>) {
    return new ApiError('INTERNAL_ERROR', message, details, 500);
  }
}

type ApiHandler<T = any> = (req: NextRequest, ...args: any[]) => Promise<NextResponse<T>>;

export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', error);
      }

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
            },
          },
          { status: error.status }
        );
      }

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request data',
              details: { issues: error.issues },
            },
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
          },
        },
        { status: 500 }
      );
    }
  };
}
