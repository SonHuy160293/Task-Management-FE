import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CircleCheck,
  Clock3,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { PageHeading } from '@/components/common/page-heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function IdentityPage() {
  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE / IDENTITY"
        title="Identity & access"
        description="The right people, with the right access, in the right workspace."
        action={
          <Button
            role="link"
            nativeButton={false}
            render={<Link to="/register" />}
          >
            Create account
            <ArrowRight />
          </Button>
        }
      />
      <section className="grid gap-6 md:grid-cols-[1.25fr_1fr]">
        <div className="rounded-xl border bg-background p-6">
          <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-primary">
            <ShieldCheck size={24} />
          </span>
          <h2 className="text-lg font-semibold">Start with a secure account</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Registration is connected to the current Identity API. Requests are
            validated, server errors are shown clearly, and acceptance responses
            protect account privacy.
          </p>
          <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-xs leading-6 text-emerald-800">
            <CircleCheck className="mr-2 inline size-4" />
            Registration available
            <code className="mt-1 block text-[11px]">
              POST /api/v1/auth/register
            </code>
          </div>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            An accepted request does not start a session or prove account
            creation. Email verification and delivery still require backend
            implementation.
          </p>
        </div>
        <div className="rounded-xl border bg-background p-6">
          <KeyRound className="mb-4 size-6 text-slate-500" />
          <h2 className="text-sm font-semibold">Session capabilities</h2>
          <ul className="mt-5 divide-y">
            {[
              'Sign in and current-user profile',
              'Session restoration and token rotation',
              'Server-side logout and revocation',
              'Organization-scoped permissions',
            ].map((text) => (
              <li
                key={text}
                className="flex items-center justify-between gap-4 py-4"
              >
                <span className="text-xs leading-5 text-muted-foreground">
                  {text}
                </span>
                <Badge>
                  <Clock3 size={11} />
                  Pending
                </Badge>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            No service integration keys are used in this browser. Backend
            authorization remains the authority for every protected operation.
          </p>
        </div>
      </section>
    </>
  );
}
