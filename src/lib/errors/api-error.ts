import axios from 'axios';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: Record<string, string[]>;
  readonly traceId?: string;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      fields?: Record<string, string[]>;
      traceId?: string;
    } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.code = options.code ?? 'Request.Failed';
    this.fields = options.fields ?? {};
    this.traceId = options.traceId;
  }
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function string(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isCancel(error))
    return new ApiError('Request canceled.', { code: 'Request.Canceled' });
  if (!axios.isAxiosError(error))
    return new ApiError('Something went wrong. Please try again.');
  const status = error.response?.status ?? 0;
  const data = record(error.response?.data);
  const problem =
    typeof data.error === 'object' && data.error !== null
      ? record(data.error)
      : data;
  const fields: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(record(problem.errors))) {
    if (Array.isArray(value) && value.every((item) => typeof item === 'string'))
      fields[key] = value;
  }
  const fallback =
    status === 401
      ? 'Your session has expired. Please sign in again.'
      : status === 403
        ? 'You do not have permission to access this resource.'
        : status === 429
          ? 'Too many requests. Please wait before trying again.'
          : status === 503
            ? 'A required service is temporarily unavailable. Please try again later.'
            : error.code === 'ECONNABORTED'
              ? 'The request timed out. Check your connection and try again.'
              : !error.response
                ? 'Unable to reach DevFlow. Check your connection and backend address.'
                : 'The request could not be completed. Please try again.';
  return new ApiError(
    string(problem.message) ??
      string(problem.detail) ??
      string(problem.title) ??
      fallback,
    {
      status,
      code:
        string(problem.code) ??
        (status ? `HTTP.${status}` : 'Network.Unavailable'),
      fields,
      traceId: string(problem.traceId) ?? string(data.traceId),
    },
  );
}
