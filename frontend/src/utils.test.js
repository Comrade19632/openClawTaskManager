import { describe, expect, it } from 'vitest'
import { formatDateTimeShort, joinBase } from './utils'

describe('utils', () => {
  it('joinBase joins base and path safely', () => {
    expect(joinBase('/taskManager/api/', '/me/')).toBe('/taskManager/api/me/')
    expect(joinBase('/taskManager/api', 'me/')).toBe('/taskManager/api/me/')
  })

  it('formatDateTimeShort returns dd.mm hh:mm', () => {
    // fixed UTC-ish date string; JS Date will parse as UTC if ends with Z
    const s = formatDateTimeShort('2026-02-09T15:26:00Z')
    expect(s).toMatch(/^\d{2}\.\d{2} \d{2}:\d{2}$/)
  })
})
