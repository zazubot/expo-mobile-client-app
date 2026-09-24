/**
 * App-wide configuration. Values that differ per environment come from
 * `EXPO_PUBLIC_*` variables in `.env` (see `.env.example`).
 *
 * `process.env.EXPO_PUBLIC_API_URL` must be referenced statically (dot
 * notation) so Expo can inline it at build time.
 */

/** Base URL of the Zazubot API, including the `/api/v1` prefix. Trailing slashes are stripped. */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');

/** SecureStore key under which the API token is persisted. */
export const TOKEN_KEY = 'zazubot_token';

/** Per-request timeout for the API client. */
export const REQUEST_TIMEOUT_MS = 15_000;

/** Page size used when paginating bot results. */
export const RESULTS_PAGE_SIZE = 25;

/** Public product name shown in the UI. */
export const APP_NAME = 'Zazubot';
