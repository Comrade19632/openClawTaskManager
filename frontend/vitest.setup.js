import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'

// In this project we don't rely on StrictMode semantics in unit-tests.
// Turning it off makes effects run once and simplifies DnD/API mocking.
configure({ reactStrictMode: false })
