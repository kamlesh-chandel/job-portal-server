import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./tests/setup/test-db.js'],
    environment: 'node',
    reporters: ['default', 'junit'],

    outputFile: {
      junit: './test-results/junit-report.xml',
    },

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
    },
  },
});
