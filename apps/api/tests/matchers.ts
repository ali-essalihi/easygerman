import AppError from '../src/AppError'
import { expect } from 'vitest'

expect.extend({
  async toThrowAppError(
    received: unknown,
    expectedStatus: number,
    expectedMessage?: string | RegExp
  ) {
    if (typeof received !== 'function') {
      return {
        pass: false,
        message: () => 'First argument must be a function',
      }
    }

    let err: unknown
    try {
      const result = received()
      if (result instanceof Promise) await result
    } catch (e) {
      err = e
    }

    if (!(err instanceof AppError)) {
      return {
        pass: false,
        message: () => 'Did not throw AppError',
      }
    }

    const statusMatches = err.status === expectedStatus
    if (!statusMatches) {
      return {
        pass: false,
        message: () => `Status ${err.status} does not match ${expectedStatus}`,
      }
    }

    const messageMatches =
      !expectedMessage ||
      (typeof expectedMessage === 'string'
        ? err.message === expectedMessage
        : expectedMessage.test(err.message))

    return {
      pass: messageMatches,
      message: () => `Message "${err.message}" does not match ${expectedMessage}`,
    }
  },
})
