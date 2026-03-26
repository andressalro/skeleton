import { vi } from 'vitest'

const mockNewPage = vi.fn().mockResolvedValue({
  setContent: vi.fn().mockResolvedValue(undefined),
  pdf: vi.fn().mockResolvedValue(Buffer.from('%PDF-FAKE')),
  close: vi.fn().mockResolvedValue(undefined),
})

const mockLaunch = vi.fn().mockResolvedValue({
  newPage: mockNewPage,
  close: vi.fn().mockResolvedValue(undefined),
  connected: true,
})

export default {
  launch: mockLaunch,
  defaultArgs: vi.fn().mockReturnValue([]),
}

// export const __mockPuppeteer = {
//   mockLaunch,
//   mockNewPage,
// }
