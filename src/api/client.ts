/**
 * Single shared axios instance.
 *
 * - Attaches `Authorization: Bearer <token>` from memory (set by AuthContext),
 *   falling back to SecureStore.
 * - Normalizes every failure into `ApiError` so screens never parse axios errors.
 * - On 401 while signed in, calls the registered sign-out handler.
 */
import axios, { isAxiosError, isCancel } from 'axios';

import { API_URL, REQUEST_TIMEOUT_MS } from '@/constants/config';
import { getToken } from '@/lib/storage';

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(init: { message: string; status?: number; code?: string }) {
    super(init.message);
    this.name = 'ApiError';
    this.status = init.status;
    this.code = init.code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Human-readable message for any thrown value. */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

/** Options accepted by every API function. */
export interface RequestOptions {
  signal?: AbortSignal;
  /**
   * Explicit token for this request only. Used by the sign-in screen to
   * validate a token before it is saved. A 401 with an override does not
   * trigger the global sign-out.
   */
  token?: string;
}

let memoryToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

/** Called by AuthContext whenever the signed-in token changes. */
export function setAuthToken(token: string | null): void {
  memoryToken = token;
}

/** Called by AuthContext to receive 401s while signed in. */
export function setOnUnauthorized(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function authHeader(token?: string): Record<string, string> | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

// eslint-disable-next-line import/no-named-as-default-member -- axios only exposes `create` on the default export at runtime
export const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (!API_URL) {
    throw new ApiError({
      code: 'NO_API_URL',
      message:
        'API URL is not configured. Set EXPO_PUBLIC_API_URL in .env and restart with `npx expo start --clear`.',
    });
  }
  if (!config.headers.Authorization) {
    const token = memoryToken ?? (await getToken());
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(undefined, (error: unknown) => {
  const apiError = toApiError(error);
  const usedOverride =
    isAxiosError(error) &&
    memoryToken !== null &&
    error.config?.headers?.Authorization !== `Bearer ${memoryToken}`;
  if (apiError.status === 401 && memoryToken !== null && !usedOverride) {
    unauthorizedHandler?.();
  }
  return Promise.reject(apiError);
});

function messageForStatus(status: number): string {
  if (status === 401) return 'Invalid or expired token.';
  if (status === 403) return 'You do not have access to this resource.';
  if (status === 404) return 'Not found.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500) return 'The server ran into a problem. Please try again.';
  return `Request failed (${status}).`;
}

function readServerError(data: unknown): { message?: string; code?: string } {
  if (typeof data !== 'object' || data === null) return {};
  const record = data as Record<string, unknown>;
  const message = typeof record.message === 'string' ? record.message : undefined;
  const code = typeof record.code === 'string' ? record.code : undefined;
  return { message, code };
}

function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (isCancel(error)) {
    return new ApiError({ code: 'CANCELLED', message: 'Request was cancelled.' });
  }
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status !== undefined) {
      const server = readServerError(error.response?.data);
      // Server messages are only shown for client errors other than auth; 401/403
      // get a consistent wording and 5xx messages are internal details.
      const useServerMessage =
        status !== 401 && status !== 403 && status < 500 && server.message !== undefined;
      return new ApiError({
        status,
        code: server.code ?? error.code,
        message: useServerMessage ? server.message! : messageForStatus(status),
      });
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError({ code: 'TIMEOUT', message: 'The request timed out. Please try again.' });
    }
    return new ApiError({
      code: 'NETWORK',
      message: 'Could not reach the server. Check your connection and try again.',
    });
  }
  if (error instanceof Error) return new ApiError({ message: error.message });
  return new ApiError({ message: 'Something went wrong. Please try again.' });
}
