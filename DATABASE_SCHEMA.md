# Database Schema

**MDF Note** uses a NoSQL-like document structure persisted via `AsyncStorage`. There is no relational database engine (like SQLite) currently implemented, so data is stored as serialized JSON strings.

## Data Models

### 1. Notes Collection

Stored under key: `NOTES_v1`

**Schema:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | UUID (string) | Yes | Unique identifier for the note. |
| `title` | String | Yes | The header text of the note. |
| `content` | String | Yes | The main body text. |
| `createdAt` | ISO String | Yes | Timestamp of creation. |
| `updatedAt` | ISO String | Yes | Timestamp of last modification. |
| `color` | Hex String | No | Background color for visual organization. |
| `isPinned` | Boolean | No | Whether the note stays at the top. |

**JSON Example:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Grocery List",
    "content": "Milk, Eggs, Bread",
    "createdAt": "2026-01-14T10:00:00.000Z",
    "updatedAt": "2026-01-14T10:05:00.000Z",
    "isPinned": true
  }
]
```

### 2. Settings / User Preferences

Stored under individual keys.

| Key | Value Type | Default | Description |
| --- | --- | --- | --- |
| `THEME_PREF` | String | `system` | UI Theme (`light`, `dark`, or `system`). |
| `SORT_ORDER` | String | `date_desc` | How notes are sorted on the home screen. |

## Relationships

Since the structure is flat, there are no complex foreign key relationships.
-   **Tags** (Future): If implemented, tags would likely be an array of strings within the Note object, or a separate `TAGS` collection referenced by ID if many-to-many is needed.

## Indexing Strategy

-   **Current:** In-memory filtering/sorting.
-   **Scalability:** `AsyncStorage` has a limit (usually 6MB on Android). For larger datasets, migration to `expo-sqlite` or Realm would be required.
