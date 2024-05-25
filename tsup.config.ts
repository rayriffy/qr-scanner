import { defineConfig } from 'tsup'

export default defineConfig({
  external: ['react', 'qr-scanner'],
})
