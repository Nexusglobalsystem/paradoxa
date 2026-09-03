import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // packages/**: the formulation engine (CLAUDE.md rule 1). app/**: route
    // handler logic that needs unit coverage without a browser DOM (e.g.
    // app/api/laboratoire/generation — Zod schema + Anthropic-client-mocked
    // retry logic).
    include: ["packages/**/*.test.ts", "app/**/*.test.ts"],
  },
});
