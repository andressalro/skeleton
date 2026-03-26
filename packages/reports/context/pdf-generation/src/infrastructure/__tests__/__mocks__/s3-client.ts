// S3 client mock

import { vi } from 'vitest'

export default {
  send: vi.fn().mockResolvedValue({}),
}
