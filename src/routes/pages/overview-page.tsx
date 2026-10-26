import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  Code2,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeading } from '@/components/common/page-heading';

const modules = [
  {
    icon: ShieldCheck,
    title: 'Identity & access',
    description: 'A secure starting point for every person in your workspace.',
    label: 'Registration available',
    tone: 'green',
    to: '/identity',
  },
  {
    icon: Building2,
    title: 'Organizations',
    description:
      'Bring your company and its workspaces into one shared context.',
    label: 'Backend required',
    tone: 'slate',
    to: '/organizations',
  },
  {
    icon: UsersRound,
    title: 'Teams',
    description: 'Connect the people who plan, build, and ship together.',
    label: 'Backend required',
    tone: 'slate',
    to: '/teams',
  },
];

export default function OverviewPage() {
  return (
    <>
      <PageHeading
        eyebrow="YOUR WORKSPACE, CONNECTED"
        title="A better flow starts here."
        description="Bring your people and organizations together. Build the foundation for great work."
        action={
          <Button
            role="link"
            nativeButton={false}
            variant="outline"
            render={<Link to="/guide" />}
          >
            Quick start guide
            <ArrowUpRight />
          </Button>
        }
      />
      <section
        className="relative mb-8 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-[#eef0ff] via-[#f3f4ff] to-[#f8faff] p-6 sm:p-8"
        aria-labelledby="welcome-heading"
      >
        <div className="relative z-10 max-w-[460px]">
          <Badge className="border-indigo-200/70 bg-white/60 text-indigo-600">
            <Sparkles className="size-3" />
            WELCOME TO DEVFLOW
          </Badge>
          <h2
            id="welcome-heading"
            className="mt-5 text-2xl font-semibold leading-tight tracking-tight sm:text-[28px]"
          >
            Your team. Your workspace.
            <br />A shared direction.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Start with an account, then connect your organization as more
            capabilities become available.
          </p>
          <Button
            role="link"
            nativeButton={false}
            className="mt-6"
            render={<Link to="/register" />}
          >
            Create your account
            <ArrowRight />
          </Button>
          <span className="ml-3 hidden text-[11px] text-slate-500 sm:inline">
            Your first step, in a few minutes
          </span>
        </div>
        <div
          className="pointer-events-none absolute -right-8 top-0 hidden h-full w-[43%] items-center justify-center xl:flex"
          aria-hidden="true"
        >
          <div className="absolute size-80 rounded-full border border-indigo-200/35" />
          <div className="absolute size-60 rounded-full border border-indigo-200/60" />
          <div className="absolute size-40 rounded-full border border-indigo-200/60 bg-white/20" />
          <div className="relative -rotate-6 rounded-2xl border border-white bg-white/90 p-5 shadow-[0_20px_70px_-25px_#6366f1]">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white">
                <Code2 size={23} />
              </span>
              <div>
                <p className="text-sm font-semibold">Built around your team</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  One connected workspace
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex -space-x-2">
                {['AM', 'JL', 'SK'].map((initials, i) => (
                  <span
                    key={initials}
                    className={`flex size-8 items-center justify-center rounded-full border-2 border-white text-[9px] font-medium ${['bg-indigo-100 text-indigo-500', 'bg-amber-100 text-amber-600', 'bg-emerald-100 text-emerald-600'][i]}`}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                <Check size={12} />
                Shared direction
              </span>
            </div>
          </div>
          <span className="absolute bottom-8 right-14 rounded-xl border border-indigo-100 bg-white p-3 text-primary shadow-sm">
            <Layers3 size={24} />
          </span>
        </div>
      </section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Your workspace essentials
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The building blocks for your engineering organization.
          </p>
        </div>
        <span className="text-[11px] text-slate-500">FOUNDATION RELEASE</span>
      </div>
      <section
        className="grid gap-4 md:grid-cols-3"
        aria-label="Workspace modules"
      >
        {modules.map(({ icon: Icon, title, description, label, tone, to }) => (
          <Link
            to={to}
            key={title}
            className="group rounded-xl border bg-background p-5 shadow-xs transition hover:border-indigo-200 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-600">
                <Icon size={20} />
              </span>
              <ArrowUpRight className="size-4 text-slate-300 transition group-hover:text-primary" />
            </div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="mb-5 mt-2 min-h-10 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
            <Badge
              className={
                tone === 'green'
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                  : ''
              }
            >
              <span
                className={`size-1.5 rounded-full ${tone === 'green' ? 'bg-emerald-500' : 'bg-slate-400'}`}
              />
              {label}
            </Badge>
          </Link>
        ))}
      </section>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section
          className="rounded-xl border bg-background"
          aria-labelledby="setup-heading"
        >
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 id="setup-heading" className="text-sm font-semibold">
              Set up your workspace
            </h2>
            <Badge>GETTING STARTED</Badge>
          </div>
          <ol className="divide-y px-5">
            {[
              {
                number: '01',
                title: 'Create your DevFlow account',
                description: 'Send your details to the Identity service.',
                to: '/register',
                available: true,
              },
              {
                number: '02',
                title: 'Connect an organization',
                description:
                  'Available after identity and organization APIs are ready.',
                to: '/organizations',
                available: false,
              },
              {
                number: '03',
                title: 'Bring your team together',
                description:
                  'Available after team and membership APIs are ready.',
                to: '/teams',
                available: false,
              },
            ].map(({ number, title, description, to, available }) => (
              <li key={number}>
                <Link
                  to={to}
                  className="flex items-center gap-4 py-5 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium ${available ? 'border-indigo-200 bg-indigo-50 text-primary' : 'border-slate-100 bg-slate-50 text-slate-500'}`}
                  >
                    {number}
                  </span>
                  <div className="flex-1">
                    <h3
                      className={`text-xs font-medium ${available ? '' : 'text-slate-500'}`}
                    >
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  {available ? (
                    <ChevronRight className="size-4 text-primary" />
                  ) : (
                    <LockKeyhole className="size-3.5 text-slate-300" />
                  )}
                </Link>
              </li>
            ))}
          </ol>
        </section>
        <section className="flex flex-col rounded-xl border bg-background p-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Layers3 size={21} />
          </div>
          <h2 className="text-base font-semibold tracking-tight">
            A clear foundation.
            <br />
            Room to grow.
          </h2>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            This release connects account registration. Organization and team
            management will open as their backend contracts become available.
          </p>
          <div className="mt-auto pt-6">
            <Link
              to="/settings"
              className="flex items-center gap-2 text-xs font-medium text-primary"
            >
              See integration readiness
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
