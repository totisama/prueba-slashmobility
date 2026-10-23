# Technical exercise: Range component

A Next.js project with App Router and TypeScript implementing a custom range component with two modes:

- `/exercise1`: a continuous range with editable values.
- `/exercise2`: a range with a fixed set of selectable values.

Live demo: [prueba-slashmobility.vercel.app](https://prueba-slashmobility.vercel.app/).

## Requirements

- Node.js 22 or later
- pnpm

## Installation and development

```bash
pnpm install
pnpm dev
```

The application will be available at [http://localhost:8080](http://localhost:8080).

Both exercises load their values from mocked HTTP services hosted on MockAPI.

## Commands

```bash
pnpm lint          # Check the code with ESLint
pnpm test          # Run the tests
pnpm format:check  # Check formatting without modifying files
pnpm format:fix    # Apply Prettier formatting
pnpm build         # Create a production build
pnpm start         # Run the production build on port 8080
```

The application code is in `src/`.
