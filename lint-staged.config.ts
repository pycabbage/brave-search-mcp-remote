import type { Configuration } from "lint-staged"

export default {
  "*.{ts,tsx,json}": ["pnpm lint"],
} satisfies Configuration
