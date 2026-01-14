# Testing Strategy

Reliability is key for **MDF Note**. This document outlines our testing layers and how to run them.

## Testing Stack

-   **Unit & Integration:** Jest
-   **React Native Integration:** Jest-Expo
-   **Component Testing:** React Test Renderer
-   **E2E (Future):** Maestro or Detox

## Running Tests

### 1. Unit Tests

Runs `jest` looking for `__tests__` folders or `.test.ts/tsx` files.

```bash
npm test
```

**Watch Mode:**

```bash
npm test -- --watch
```

### 2. Linting

Ensures code quality and consistency using standard Expo config.

```bash
npm run lint
```

## Writing Tests

### Component Test Example

We use `react-test-renderer` to verify UI snapshots and logic.

```typescript
import renderer from 'react-test-renderer';
import React from 'react';
import { Title } from '../components/Title';

describe('<Title />', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<Title />).toJSON();
        // @ts-ignore
        expect(tree.children.length).toBe(1);
    });
});
```

## Coverage Requirements

-   **Business Logic (Hooks/Utils):** Aim for > 80% coverage.
-   **UI Components:** Snapshot tests for all shared components.
-   **Screens:** Integration tests for critical user flows (e.g., Note Creation).

## Continuous Integration (CI)

Tests are automatically run on Pull Requests via GitHub Actions (if configured). All tests must pass before merging.
