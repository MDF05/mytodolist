# Environment Variables

**MDF Note** uses environment configurations to manage behavior across different stages (Development, Preview, Production).

## Configuration Files

The primary configuration logic resides in `app.json` and optionally `.env` files if sensitive keys are introduced (e.g., API keys).

### `app.json`

Controls static configuration for the Expo app.

-   **name:** App display name.
-   **slug:** URL slug for Expo services.
-   **version:** App version string (e.g., 1.0.0).
-   **orientation:** Lock specific orientation (default: portrait).
-   **scheme:** Deep linking scheme (e.g., `mdfnote://`).

### `.env` Structure (Example)

*Currently, the app does not require sensitive API keys. Behavior is configuration-driven.*

If added in the future, follow this pattern:

```bash
# .env.local
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_ANALYTICS_ID=xxxxx
```

> **Note:** In Expo, variables prefixed with `EXPO_PUBLIC_` are automatically inlined into the JavaScript bundle during the build.

## Secrets Management

1.  **Never commit `.env` files to Git.** (Add to `.gitignore`).
2.  **EAS Secrets:** For cloud builds, use EAS Secrets to inject variables.
    ```bash
    eas secret:create
    ```

## Environment Specifics

| Environment | Debug Mode | Logs Enabled | Updates |
| --- | --- | --- | --- |
| **Development** | Yes | Yes | Hot Reload |
| **Preview** | No | Minimal | OTA Updates |
| **Production** | No | No | OTA Updates |
