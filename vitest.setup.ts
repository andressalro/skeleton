import { vi } from 'vitest'

// Compatibility shim for legacy Jest-style tests still present in the repo.
;(globalThis as typeof globalThis & { jest: typeof vi }).jest = vi
