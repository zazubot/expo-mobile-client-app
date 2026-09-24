# Zazubot

Mobile companion for Zazubot. Paste an API token once, then browse your workspaces, the bots inside each workspace, and the results (conversations) of any bot. Built with Expo, Expo Router, React Query and axios.

## Requirements

- Node 20+ and [pnpm](https://pnpm.io)
- Expo Go on a device, or an iOS Simulator / Android emulator

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure the API base URL. Copy `.env.example` to `.env` and set:

   ```bash
   EXPO_PUBLIC_API_URL=https://your-zazubot-host/api/v1
   ```

3. Start the dev server:

   ```bash
   npx expo start
   ```

   Environment variables are inlined at bundle time. After changing `.env`, restart with `npx expo start --clear`.

## Signing in

Create an API token in Zazubot under **Settings & Members › My account › API tokens**, then paste it on the token screen. The token is validated against the API before it is saved, and it is stored encrypted with `expo-secure-store` (iOS Keychain / Android Keystore). Sign out from any screen header to remove it.

## Scripts

```bash
pnpm start        # expo start
pnpm typecheck    # tsc --noEmit
pnpm lint         # expo lint
```

## Project layout

```
src/
  app/                     # Expo Router routes
    _layout.tsx            # providers + auth gate (Stack.Protected)
    (auth)/token.tsx       # token entry (sign in)
    (app)/index.tsx        # Workspaces
    (app)/workspaces/[workspaceId].tsx   # Bots in a workspace
    (app)/bots/[botId]/results.tsx       # Results + stats for a bot
  api/                     # axios client + one module per endpoint
  hooks/                   # React Query hooks and theme hooks
  context/AuthContext.tsx  # token state, signIn, signOut
  components/              # shared UI
  lib/                     # storage, formatting, query client
  constants/               # config and design tokens
  types/                   # API types (source of truth)
```
