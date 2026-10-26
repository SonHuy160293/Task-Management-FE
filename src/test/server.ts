import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const acceptedMessage =
  'If eligible, your registration request has been accepted.';
export const registrationUrl = 'http://localhost:3000/api/v1/auth/register';

export const server = setupServer(
  http.post(registrationUrl, () =>
    HttpResponse.json(
      { success: true, data: { message: acceptedMessage }, error: null },
      { status: 202 },
    ),
  ),
);
