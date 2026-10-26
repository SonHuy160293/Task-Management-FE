import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff, LoaderCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  registrationSchema,
  type RegistrationValues,
} from '@/features/auth/schemas/registration';
import { useRegistration } from '@/features/auth/hooks/use-registration';
import { ApiError } from '@/lib/errors/api-error';

const fieldNames = [
  'displayName',
  'email',
  'password',
  'locale',
  'timeZone',
] as const;

export function RegistrationForm() {
  const mutation = useRegistration();
  const [visible, setVisible] = useState(false);
  const [acceptedMessage, setAcceptedMessage] = useState<string>();
  const [requestError, setRequestError] = useState<ApiError>();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    shouldFocusError: false,
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      locale: 'en',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    },
  });
  const focusField = (name: (typeof fieldNames)[number]) => {
    if (name === 'locale' || name === 'timeZone') setPreferencesOpen(true);
    // Let RHF finish submission and re-enable the fieldset before focusing.
    setTimeout(() => form.setFocus(name), 0);
  };
  const submit = form.handleSubmit(
    async (values) => {
      setRequestError(undefined);
      try {
        const response = await mutation.mutateAsync(values);
        setAcceptedMessage(response.message);
        form.reset();
        mutation.reset();
        toast.success('Registration request accepted');
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(
                'Registration could not be completed. Please try again.',
              );
        setRequestError(apiError);
        let first: (typeof fieldNames)[number] | undefined;
        for (const [key, messages] of Object.entries(apiError.fields)) {
          const field = fieldNames.find(
            (name) => name.toLowerCase() === key.toLowerCase(),
          );
          if (field) {
            form.setError(field, {
              type: 'server',
              message: messages.join(' '),
            });
            first ??= field;
          }
        }
        if (first) focusField(first);
        mutation.reset();
      }
    },
    (errors) => {
      const first = fieldNames.find((name) => errors[name]);
      if (first) focusField(first);
    },
  );

  if (acceptedMessage)
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"
      >
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check />
        </div>
        <h2 className="text-lg font-semibold">Request received</h2>
        <p className="mt-2 text-sm leading-6">{acceptedMessage}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          This response protects account privacy and does not confirm account
          creation. Email delivery, verification, and sign-in are awaiting
          backend support.
        </p>
        <Button
          variant="outline"
          className="mt-5"
          onClick={() => setAcceptedMessage(undefined)}
        >
          Back to registration
        </Button>
      </div>
    );

  const field = (
    name: (typeof fieldNames)[number],
    label: string,
    options: {
      type?: string;
      placeholder?: string;
      autoComplete?: string;
      hint?: string;
    } = {},
  ) => (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <Input
          id={name}
          type={
            name === 'password' ? (visible ? 'text' : 'password') : options.type
          }
          placeholder={options.placeholder}
          autoComplete={options.autoComplete}
          aria-invalid={Boolean(form.formState.errors[name])}
          aria-describedby={`${name}-help ${name}-error`}
          className={name === 'password' ? 'pr-11' : undefined}
          {...form.register(name)}
        />
        {name === 'password' && (
          <button
            type="button"
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="absolute right-2 top-2 rounded p-1 text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <p
        id={`${name}-help`}
        className="text-xs leading-5 text-muted-foreground"
      >
        {options.hint}
      </p>
      <p
        id={`${name}-error`}
        role={form.formState.errors[name] ? 'alert' : undefined}
        className="text-xs text-destructive"
      >
        {form.formState.errors[name]?.message}
      </p>
    </div>
  );

  const pending = form.formState.isSubmitting;
  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-5"
      aria-label="Create account"
      aria-busy={pending}
    >
      <fieldset disabled={pending} className="space-y-5 disabled:opacity-70">
        <legend className="sr-only">Account details</legend>
        {field('displayName', 'Full name', {
          placeholder: 'Alex Morgan',
          autoComplete: 'name',
        })}
        {field('email', 'Work email', {
          type: 'email',
          placeholder: 'alex@company.com',
          autoComplete: 'email',
        })}
        {field('password', 'Password', {
          autoComplete: 'new-password',
          hint: 'Use a unique passphrase with 15–128 characters. Spaces are welcome.',
        })}
        <details
          open={preferencesOpen}
          onToggle={(event) => setPreferencesOpen(event.currentTarget.open)}
          className="rounded-lg border px-4 py-3"
        >
          <summary className="cursor-pointer text-sm font-medium">
            Language & time zone
          </summary>
          <div className="mt-4 space-y-4">
            {field('locale', 'Language tag', {
              placeholder: 'en',
              hint: 'For example, en or vi-VN.',
            })}
            {field('timeZone', 'Time zone', {
              placeholder: 'Asia/Ho_Chi_Minh',
              hint: 'Your browser’s time zone is selected automatically.',
            })}
          </div>
        </details>
      </fieldset>
      {requestError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p>{requestError.message}</p>
          {Object.entries(requestError.fields)
            .filter(
              ([key]) =>
                !fieldNames.some(
                  (name) => name.toLowerCase() === key.toLowerCase(),
                ),
            )
            .map(([key, messages]) => (
              <p key={key} className="mt-1">
                {messages.join(' ')}
              </p>
            ))}
          {requestError.traceId && (
            <p className="mt-2 text-xs">Reference: {requestError.traceId}</p>
          )}
        </div>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <LoaderCircle className="animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            Create account
            <ArrowRight />
          </>
        )}
      </Button>
      <p className="text-center text-xs leading-5 text-muted-foreground">
        Your password is sent only to your configured Identity API. Use HTTPS
        outside local development.
      </p>
    </form>
  );
}
