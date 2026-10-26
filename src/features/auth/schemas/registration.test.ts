import { registrationSchema } from '@/features/auth/schemas/registration';

const valid = {
  displayName: ' Alex ',
  email: 'alex@example.com',
  password: 'a long unique passphrase',
  locale: 'en',
  timeZone: 'Asia/Ho_Chi_Minh',
};

it('trims account identifiers and preserves password whitespace', () => {
  const data = registrationSchema.parse({
    ...valid,
    password: '  a unique passphrase  ',
  });
  expect(data.displayName).toBe('Alex');
  expect(data.password).toBe('  a unique passphrase  ');
});

it.each(['short', '😀'.repeat(14), 'x'.repeat(129), '\ud800'.repeat(15)])(
  'rejects invalid passwords without a composition rule',
  (password) => {
    expect(registrationSchema.safeParse({ ...valid, password }).success).toBe(
      false,
    );
  },
);

it('counts astral Unicode code points rather than UTF-16 units', () => {
  expect(
    registrationSchema.safeParse({ ...valid, password: '😀'.repeat(15) })
      .success,
  ).toBe(true);
  expect(
    registrationSchema.safeParse({ ...valid, password: '😀'.repeat(128) })
      .success,
  ).toBe(true);
});

it.each([
  { timeZone: 'Mars/Olympus' },
  { locale: 'en_US' },
  { email: 'invalid' },
  { displayName: ' ' },
])('rejects invalid account details', (changes) => {
  expect(registrationSchema.safeParse({ ...valid, ...changes }).success).toBe(
    false,
  );
});
