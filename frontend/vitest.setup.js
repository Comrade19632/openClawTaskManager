import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// In this project we don't rely on StrictMode semantics in unit-tests.
// Turning it off makes effects run once and simplifies DnD/API mocking.
configure({ reactStrictMode: false })

// Explicit cleanup between tests to avoid DOM leaking across test-cases.
afterEach(() => cleanup())
