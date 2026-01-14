# Style Guide

To maintain a clean and consistent codebase, **MDF Note** follows strict styling and coding conventions.

## Code Formatting

We use **ESLint** and **Prettier** (via Expo's default config) to enforce formatting.

-   **Indentation:** 2 spaces
-   **Quotes:** Single quotes preferred
-   **Semi-colons:** Always used

## Naming Conventions

### Files & Folders

-   **Components:** PascalCase (e.g., `NoteCard.tsx`, `Header.tsx`)
-   **Hooks:** camelCase, prefixed with `use` (e.g., `useNotes.ts`)
-   **Utils/Constants:** camelCase (e.g., `dateFormatter.ts`)
-   **Screens (App Router):** lowercase/kebab-case (e.g., `app/note-detail.tsx`, `app/settings/index.tsx`)

### Variables & Functions

-   **Variables:** camelCase (e.g., `isLoading`, `noteTitle`)
-   **Components:** PascalCase (e.g., `function NoteList() { ... }`)
-   **Constants:** SCREAMING_SNAKE_CASE (e.g., `MAX_NOTE_LENGTH`)
-   **Types/Interfaces:** PascalCase (e.g., `Note`, `ThemeConfig`)

## Component Structure

Components should follow this order:

1.  **Imports:** External first, then internal.
2.  **Type Definitions:** Interfaces/Types if local.
3.  **Component Definition:**
    -   Hooks usage
    -   Helper functions
    -   Return (JSX)
4.  **Styles:** `StyleSheet.create(...)` at the bottom.

**Example:**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
}

export function Title({ title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  text: { fontSize: 20, fontWeight: 'bold' },
});
```
