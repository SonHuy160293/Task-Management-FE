import { z } from 'zod';

const configSchema = z.object({
  appName: z.string().min(1),
  apiBaseUrl: z
    .string()
    .refine(
      (value) => /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value),
      'Use a same-origin path such as /api or an absolute HTTP(S) URL.',
    ),
});

export const config = configSchema.parse({
  appName: import.meta.env.VITE_APP_NAME || 'DevFlow',
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, ''),
});
