# AGENTS.md — Zazubot

Guidance for AI coding agents working in this repository. Read this file fully before making changes.

## Project overview

Zazubot is a React Native app built with Expo. The user signs in by pasting an API token, which is saved on the device. After that, the app lets them browse their workspaces, the bots inside a workspace, and the results (submissions/conversations) of a specific bot. The user can sign out, which deletes the stored token and returns them to the token screen.

## Tech stack

- Expo (managed workflow) + React Native + TypeScript (strict mode)
- Navigation: `expo-router` (file-based routing)
- HTTP: `axios` (single shared instance)
- Token storage: `expo-secure-store` (see note below)
- Server state: `@tanstack/react-query` (caching, loading/error states, pull-to-refresh, pagination)

> **Storage note:** React Native has no `localStorage`. The "save token to storage / remove on sign out" requirement is implemented with `expo-secure-store`, which stores the token encrypted in the iOS Keychain / Android Keystore. Do not store the token in `AsyncStorage` or in plain state that persists to disk. If a web build is ever needed, add a fallback to `localStorage` behind a `Platform.OS === 'web'` check inside `src/lib/storage.ts` only.

## Commands

```bash
npx expo install          # install/align native-compatible deps
npx expo start            # dev server
npx expo start --clear    # dev server with cache cleared
npx tsc --noEmit          # type check (must pass before finishing a task)
npx expo lint             # lint
```

Always use `npx expo install <pkg>` (not `npm install`) for any package with native code so versions match the Expo SDK.

## Source of truth for API data: `src/types`

**`/src/types` defines the shape of every API request and response. Read it before writing any API, hook, or screen code.**

- Import types from `src/types`; never redeclare or guess API shapes inline.
- Do not invent fields. If a screen needs a field that doesn't exist in `src/types`, stop and flag it rather than adding it.
- Do not edit files in `src/types` to make code compile. If a type looks wrong versus the real API response, report it.
- Use the exact field names from the types (e.g. whether IDs are `id` or `_id`, whether lists are wrapped like `{ items, nextCursor }` or returned as bare arrays). Pagination for results must follow whatever the result list type describes.
- Use the type names found there for `Workspace`, `Bot`, `Result` (or their equivalents) in all function signatures below.

## Project structure

```
app/                          # expo-router routes
  _layout.tsx                 # root: QueryClientProvider + AuthProvider + auth gate
  (auth)/
    _layout.tsx
    token.tsx                 # token entry screen (sign in)
  (app)/
    _layout.tsx               # stack for signed-in screens, header has Sign out
    index.tsx                 # Workspaces list
    workspaces/[workspaceId].tsx          # Bots list for a workspace
    bots/[botId]/results.tsx              # Results list for a bot
src/
  types/                      # API types — source of truth (read-only for agents)
  api/
    client.ts                 # axios instance + interceptors
    workspaces.ts             # getWorkspaceList
    bots.ts                   # getBotList
    results.ts                # getResultsList
    index.ts                  # re-exports
  hooks/
    useWorkspaces.ts
    useBots.ts
    useResults.ts
  context/
    AuthContext.tsx           # token state, signIn, signOut
  lib/
    storage.ts                # SecureStore wrapper (get/set/remove token)
  components/                 # shared UI: ListItem, EmptyState, ErrorState, Loader
  constants/
    config.ts                 # API base URL, storage key
```

## Configuration

- API base URL comes from `EXPO_PUBLIC_API_URL` in `.env` and is read in `src/constants/config.ts`. Never hardcode URLs elsewhere.
- Storage key: `TOKEN_KEY = 'zazubot_token'`, defined once in `src/constants/config.ts`.
- Never commit `.env` or any real token. Never log the token.

## Authentication flow

1. On launch, the root layout reads the token from SecureStore via `AuthContext`. While loading, show a splash/loader (no flicker to the token screen).
2. No token → redirect to `(auth)/token`. Token present → redirect to `(app)`.
3. **Token screen:** a single secure text input ("API token"), a "Continue" button, and inline error text.
   - Trim the input; disable the button when empty or while submitting.
   - Validate the token by calling `getWorkspaceList()` with it. Only save it if that call succeeds; on 401/403 show "Invalid token", on network errors show a retry-able message.
   - On success: `signIn(token)` saves to SecureStore, updates context, navigates to Workspaces.
4. **Sign out:** available in the header of signed-in screens. Show a confirmation alert, then `signOut()` must:
   - delete the token from SecureStore,
   - clear it from context,
   - call `queryClient.clear()` so no cached data from the previous token remains,
   - redirect to `(auth)/token`.
5. **Expired/invalid token:** the axios response interceptor treats a 401 on any request as signed-out and triggers the same `signOut()` path.

`AuthContext` exposes: `token: string | null`, `isLoading: boolean`, `signIn(token: string): Promise<void>`, `signOut(): Promise<void>`.

## API layer (axios)

### `src/api/client.ts`

- Create one axios instance with `baseURL` from config, `timeout: 15000`, and `Content-Type: application/json`.
- Request interceptor: read the token (from memory, set by `AuthContext`, falling back to SecureStore) and set `Authorization: Bearer <token>`. Confirm the header scheme against the API docs/types; adjust only here if it differs.
- Response interceptor: on 401 call the registered sign-out handler; normalize errors into a single `ApiError` shape (`{ status?: number; message: string }`) so screens don't parse axios errors themselves.
- Export a `setAuthToken(token | null)` and `setOnUnauthorized(fn)` so `AuthContext` can wire itself in without circular imports.

### API functions

Each function lives in its own module, is fully typed with types from `src/types`, returns the response data (not the axios response), and accepts an optional `AbortSignal`. Endpoint paths below are placeholders — confirm them against the API and keep them in one place per module.

```ts
// src/api/workspaces.ts
getWorkspaceList(opts?: { signal?: AbortSignal }): Promise<Workspace[] /* or list type from src/types */>
// GET /workspaces

// src/api/bots.ts
getBotList(workspaceId: string, opts?: { signal?: AbortSignal }): Promise<Bot[]>
// GET /workspaces/:workspaceId/bots   (or /bots?workspaceId=...)

// src/api/results.ts
getResultsList(
  botId: string,
  params?: { cursor?: string; limit?: number }, // match pagination in src/types
  opts?: { signal?: AbortSignal }
): Promise<ResultsPage /* type from src/types */>
// GET /bots/:botId/results
```

Hooks wrap these with React Query:

- `useWorkspaces()` → query key `['workspaces']`
- `useBots(workspaceId)` → `['bots', workspaceId]`, `enabled: !!workspaceId`
- `useResults(botId)` → `['results', botId]`, use `useInfiniteQuery` if the API paginates

Screens must call hooks, never the API functions or axios directly.

## Screens

### 1. Token (sign in) — `app/(auth)/token.tsx`

As described in the auth flow. Include the Zazubot name/logo, keyboard-avoiding layout, `secureTextEntry` with a show/hide toggle, `autoCapitalize="none"`, `autoCorrect={false}`.

### 2. Workspaces — `app/(app)/index.tsx`

- Title "Workspaces", Sign out button in the header.
- `FlatList` of workspaces showing name (and any useful secondary field from the type, e.g. icon or plan).
- Tap → push `workspaces/[workspaceId]`, passing the workspace name for the header title.

### 3. Bots — `app/(app)/workspaces/[workspaceId].tsx`

- Header title is the workspace name.
- `FlatList` of bots in that workspace: name plus relevant info from the `Bot` type (status, last updated, etc.).
- Tap → push `bots/[botId]/results`, passing the bot name.

### 4. Bot results — `app/(app)/bots/[botId]/results.tsx`

- Header title is the bot name.
- `FlatList` of results for that bot, newest first. Each row shows the created date and a short preview of the answers/variables as defined by the result type.
- Infinite scroll via `onEndReached` if paginated.
- Tapping a result may expand it or open a detail view showing all fields — only build a separate detail screen if asked.

### Required states on every list screen

- Loading: centered spinner on first load.
- Error: message + "Retry" button (calls `refetch`).
- Empty: friendly empty-state text ("No bots in this workspace yet").
- Pull-to-refresh via `refreshing` / `onRefresh`.

## Code conventions

- TypeScript strict; no `any`. Use `unknown` and narrow if needed.
- Functional components and hooks only. Named exports except route files (expo-router needs default exports).
- Keep screens thin: data via hooks, rendering via components in `src/components`.
- Use `StyleSheet.create`; no inline style objects in list rows.
- Dates: format with `Intl.DateTimeFormat` or a single helper in `src/lib/format.ts`.
- Use `keyExtractor` with the entity ID field from `src/types`.
- Handle safe areas with `react-native-safe-area-context`.

## Definition of done

Before finishing any task:

1. `npx tsc --noEmit` passes.
2. `npx expo lint` passes.
3. The app runs with `npx expo start`, and the full path works: enter token → workspaces → bots → results → sign out → back on the token screen with storage cleared.
4. No token, secrets, or `.env` values appear in code, logs, or commits.

## Don'ts

- Don't use `localStorage` or `AsyncStorage` for the token.
- Don't call axios directly from components.
- Don't guess API fields or endpoints; check `src/types` and ask if unclear.
- Don't modify `src/types` to silence type errors.
- Don't add new dependencies without a clear reason; prefer Expo-compatible packages via `npx expo install`.
