# API Documentation

Since **MDF Note** is a local-first application, it does not rely on a traditional REST or GraphQL backend API. Instead, its "API" consists of internal Hooks and Data Access Layers that components interact with.

## Data Access Layer

The app uses `AsyncStorage` to persist data.

### Storage Keys

| Key | Type | Description |
| --- | --- | --- |
| `NOTES_v1` | `JSON` | Array of Note objects. |
| `THEME_PREF` | `string` | User's theme preference ('light' \| 'dark'). |

### Note Object Structure

```typescript
interface Note {
  id: string;       // Unique UUID
  title: string;    // Title of the note
  content: string;  // Body content
  createdAt: string;// ISO 8601 Date String
  updatedAt: string;// ISO 8601 Date String
  tags?: string[];  // Optional tags
}
```

## Internal Hooks API

### `useNotes()`

Manages the list of notes.

**Returns:**
-   `notes`: `Note[]` - List of all notes.
-   `isLoading`: `boolean` - Loading state.
-   `addNote(note: Omit<Note, 'id'>)`: `Promise<void>` - Adds a new note.
-   `updateNote(id: string, updates: Partial<Note>)`: `Promise<void>` - Updates an existing note.
-   `deleteNote(id: string)`: `Promise<void>` - Removes a note.

**Example Usage:**

```typescript
const { notes, addNote } = useNotes();

const handleSave = () => {
    addNote({ title: 'New Idea', content: '...' });
};
```

### `useTheme()`

Manages application theme state.

**Returns:**
-   `theme`: `'light' | 'dark'` - Current theme.
-   `toggleTheme()`: `void` - Switches between light and dark modes.

## Error Handling

-   **Storage Errors:** Wrapped in try/catch blocks within hooks.
-   **UI Feedback:** Alerts or Toast messages are displayed to the user upon failure (e.g., "Failed to save note").
