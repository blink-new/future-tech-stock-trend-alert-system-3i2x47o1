import { createClient as createBlinkClient } from '@blinkdotnew/sdk'

export const createClient = createBlinkClient

export const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})