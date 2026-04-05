Create a new reusable UI component named **$ARGUMENTS**.

## Rules

- File location: `src/components/ui/$ARGUMENTS.tsx`
- Use a named function component with the name in PascalCase
- Style exclusively with Tailwind CSS utility classes — no separate CSS files
- Do NOT add the component to any page, route, or Navbar

## Component requirements

**Variants** — support these color variants (matching the existing `Button.tsx` palette):
`primary` | `light` | `dark` | `warning` | `danger` | `success`
Default to `primary`.

**Sizes** — support `sm` | `md` | `lg`, default to `md`.

**Disabled state** — accept a `disabled` prop; when true, reduce opacity, change cursor to `not-allowed`, and suppress interactions.

**Props type** — define a named `${ARGUMENTS}Props` TypeScript interface at the top of the file.

## Test file

Also create `src/components/ui/$ARGUMENTS.test.tsx`.

**Before writing the test**, check whether vitest is already set up:
- Look for `vitest` in `package.json` devDependencies
- If missing, install it first:
  ```
  npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
  ```
  Then add to `package.json` scripts: `"test": "vitest run"` and `"test:watch": "vitest"`
  Then add a `vitest.config.ts` at the project root:
  ```ts
  import { defineConfig } from 'vitest/config'
  import react from '@vitejs/plugin-react'
  export default defineConfig({
    plugins: [react()],
    test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test-setup.ts'] },
  })
  ```
  And create `src/test-setup.ts`:
  ```ts
  import '@testing-library/jest-dom'
  ```

**Test cases to cover** (at minimum):
1. Renders without crashing
2. Renders children / label content correctly
3. Each variant applies a distinct class or renders visually distinct
4. Each size (`sm`, `md`, `lg`) applies the correct size class
5. Disabled state: the component has correct attributes/classes when `disabled={true}`
6. Disabled state: interactions (click) are suppressed when disabled

## Execution

After writing both files, run:
```
npm test
```

If any tests fail, read the error output, fix the component or tests, and run again. Repeat until all tests pass.
