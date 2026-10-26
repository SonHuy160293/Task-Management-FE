import axios, { type InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config/env';
import { session, type SessionController } from '@/lib/auth/session';
import { ApiError, normalizeApiError } from '@/lib/errors/api-error';

declare module 'axios' {
  interface AxiosRequestConfig {
    authentication?: 'omit';
  }
}

interface AuthConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
  _sessionToken?: string;
}

export function createHttpClient(baseURL: string, auth: SessionController) {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: { Accept: 'application/json' },
  });
  client.interceptors.request.use((request: AuthConfig) => {
    const token =
      request.authentication === 'omit' ? undefined : auth.getAccessToken();
    request._sessionToken = token;
    if (token) request.headers.set('Authorization', `Bearer ${token}`);
    else request.headers.delete('Authorization');
    return request;
  });
  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (axios.isCancel(error)) return Promise.reject(error);
      if (!axios.isAxiosError(error))
        return Promise.reject(normalizeApiError(error));
      const request = error.config as AuthConfig | undefined;
      // Never replay writes automatically: even a 401 may have ambiguous effects
      // behind a proxy. Public registration must never trigger a session refresh.
      const canReplay =
        request && ['get', 'head', 'options'].includes(request.method ?? 'get');
      if (
        error.response?.status === 401 &&
        request?._sessionToken &&
        auth.available
      ) {
        if (!request._retried && canReplay) {
          request._retried = true;
          try {
            const currentToken = auth.getAccessToken();
            if (!currentToken) throw new Error('Session ended.');
            if (currentToken === request._sessionToken)
              await auth.refreshAccessToken();
            return await client(request);
          } catch {
            return Promise.reject(normalizeApiError(error));
          }
        }
        // A stale response from a logged-out request must not alter a new session.
        if (auth.getAccessToken() === request._sessionToken) auth.expire();
      }
      return Promise.reject(normalizeApiError(error));
    },
  );
  return client;
}

export const http = createHttpClient(config.apiBaseUrl, session);

export function unwrapResponse<T>(
  value: unknown,
  parse: (data: unknown) => T,
): T {
  if (value && typeof value === 'object' && 'success' in value) {
    const envelope = value as { success: unknown; data?: unknown };
    if (envelope.success !== true)
      throw new ApiError('The server rejected this request.', {
        code: 'Response.Invalid',
      });
    return parse(envelope.data);
  }
  // Swagger currently describes the DTO directly; the active MVC filter wraps
  // it at runtime. Accept both shapes, then validate the actual payload.
  return parse(value);
}
