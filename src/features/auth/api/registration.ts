import { z } from 'zod';
import { http, unwrapResponse } from '@/lib/http/client';
import { ApiError } from '@/lib/errors/api-error';
import type {
  RegisterRequest,
  RegistrationAcceptedResponse,
} from '@/features/auth/types/auth';

const acceptedSchema = z.object({ message: z.string().min(1) });

export async function registerAccount(
  request: RegisterRequest,
  signal?: AbortSignal,
): Promise<RegistrationAcceptedResponse & { message: string }> {
  const response = await http.post<unknown>('/v1/auth/register', request, {
    signal,
    authentication: 'omit',
  });
  try {
    if (response.status !== 202) throw new Error('Expected HTTP 202 Accepted.');
    return unwrapResponse(response.data, (value) =>
      acceptedSchema.parse(value),
    );
  } catch {
    throw new ApiError(
      'DevFlow returned an unexpected response. Please contact support before submitting again.',
      { status: response.status, code: 'Response.Invalid' },
    );
  }
}
