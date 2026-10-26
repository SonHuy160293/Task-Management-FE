import { ArrowLeft, Layers3, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RegistrationForm } from '@/features/auth/components/registration-form';
import { Brand } from '@/components/layout/brand';

const benefits = [
  { icon: Users, label: 'Bring your people together' },
  { icon: Layers3, label: 'Keep every workspace in context' },
  { icon: ShieldCheck, label: 'Build on secure, scoped access' },
];

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
        <div className="absolute -left-32 top-40 size-[560px] rounded-full border border-white/5" />
        <div className="absolute -left-10 top-60 size-[400px] rounded-full border border-white/5" />
        <Brand light />
        <div className="relative max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs text-indigo-200">
            <span className="size-1.5 rounded-full bg-indigo-400" />
            Your engineering workspace
          </div>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Great software starts with a connected team.
          </h2>
          <p className="mt-6 text-base leading-7 text-slate-400">
            A shared foundation for your people, organizations, and the work
            ahead.
          </p>
          <div className="mt-10 space-y-5">
            {benefits.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <Icon className="size-5 text-indigo-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400">
          DevFlow · Built for engineering teams
        </p>
      </div>
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to workspace
        </Link>
        <div className="mx-auto my-auto w-full max-w-[400px] py-10">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <p className="eyebrow">GET STARTED</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mb-8 mt-3 text-sm leading-6 text-muted-foreground">
            Start with your details. Organization setup will become available
            when the backend supports it.
          </p>
          <RegistrationForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign-in availability
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          DevFlow Identity · Account registration
        </p>
      </div>
    </main>
  );
}
