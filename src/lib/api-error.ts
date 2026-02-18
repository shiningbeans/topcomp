import { NextResponse } from 'next/server'

export class ApiError extends Error {
  public readonly status: number
  public readonly code: string

  constructor(message: string, status: number, code: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }

  static badRequest(message = 'Bad request'): ApiError {
    return new ApiError(message, 400, 'BAD_REQUEST')
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(message, 401, 'UNAUTHORIZED')
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(message, 403, 'FORBIDDEN')
  }

  static notFound(message = 'Not found'): ApiError {
    return new ApiError(message, 404, 'NOT_FOUND')
  }

  static conflict(message = 'Conflict'): ApiError {
    return new ApiError(message, 409, 'CONFLICT')
  }

  static tooManyRequests(message = 'Too many requests'): ApiError {
    return new ApiError(message, 429, 'TOO_MANY_REQUESTS')
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(message, 500, 'INTERNAL_ERROR')
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status }
    )
  }

  console.error('Unhandled error:', error)
  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
    { status: 500 }
  )
}

type ApiHandler = (request: Request) => Promise<NextResponse>

export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (request: Request): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
