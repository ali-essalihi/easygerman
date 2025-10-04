import 'vitest'

interface CustomMatchers<R = unknown> {
  toThrowAppError: (expectedStatus: number, expectedMessage?: string | RegExp) => Promise<R>
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
