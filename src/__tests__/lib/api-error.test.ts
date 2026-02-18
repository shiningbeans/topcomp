import { describe, it, expect } from 'vitest'
import { ApiError, handleApiError } from '@/lib/api-error'

describe('ApiError', () => {
  it('creates a not found error with correct status', () => {
    const error = ApiError.notFound('User not found')
    expect(error.status).toBe(404)
    expect(error.code).toBe('NOT_FOUND')
    expect(error.message).toBe('User not found')
  })

  it('creates unauthorized error with defaults', () => {
    const error = ApiError.unauthorized()
    expect(error.status).toBe(401)
    expect(error.code).toBe('UNAUTHORIZED')
    expect(error.message).toBe('Unauthorized')
  })

  it('handleApiError returns JSON response for ApiError', async () => {
    const error = ApiError.unauthorized()
    const response = handleApiError(error)
    const body = await response.json()
    expect(response.status).toBe(401)
    expect(body.error.code).toBe('UNAUTHORIZED')
  })

  it('handleApiError returns 500 for unknown errors', async () => {
    const error = new Error('something broke')
    const response = handleApiError(error)
    const body = await response.json()
    expect(response.status).toBe(500)
    expect(body.error.code).toBe('INTERNAL_ERROR')
  })
})
