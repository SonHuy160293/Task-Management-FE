import { z } from 'zod';

function validTimeZone(value: string) {
  if (value !== 'UTC' && !value.includes('/')) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export const registrationSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Enter your display name.')
    .max(160, 'Use 160 characters or fewer.'),
  email: z
    .string()
    .trim()
    .min(3, 'Enter a valid email address.')
    .max(320, 'Use 320 characters or fewer.')
    .pipe(z.email('Enter a valid email address.')),
  // Count Unicode code points like .NET Rune, preserving password whitespace.
  password: z.string().refine((value) => {
    const points = Array.from(value);
    return (
      points.length >= 15 &&
      points.length <= 128 &&
      points.every((point) => {
        const code = point.codePointAt(0)!;
        return code < 0xd800 || code > 0xdfff;
      })
    );
  }, 'Use 15–128 Unicode characters. Spaces are welcome.'),
  locale: z
    .string()
    .trim()
    .max(16)
    .regex(
      /^[A-Za-z]{2,8}(-[A-Za-z0-9]{1,8})*$/,
      'Enter a language tag, such as en or vi-VN.',
    )
    .refine((value) => {
      try {
        Intl.getCanonicalLocales(value);
        return true;
      } catch {
        return false;
      }
    }, 'Enter a valid language tag.'),
  timeZone: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .refine(
      validTimeZone,
      'Enter an IANA time zone, such as Asia/Ho_Chi_Minh.',
    ),
});

export type RegistrationValues = z.infer<typeof registrationSchema>;
