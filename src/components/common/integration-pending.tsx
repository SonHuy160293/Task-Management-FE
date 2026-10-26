import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Code2, LockKeyhole } from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/common/states';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function IntegrationPending({
  icon,
  title,
  description,
  needs,
  features,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  needs: string[];
  features: string[];
}) {
  return (
    <>
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200/70 bg-amber-50/60 px-4 py-3">
        <LockKeyhole className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <p className="text-xs leading-5 text-amber-900">
          Integration pending. This area is waiting for verified backend
          endpoints. No workspace data is being requested or displayed.
        </p>
      </div>
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        action={
          <Button
            role="link"
            nativeButton={false}
            variant="outline"
            render={<Link to="/settings" />}
          >
            View integration status
            <ArrowUpRight />
          </Button>
        }
      />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Code2 size={17} className="text-primary" />
            <h2 className="text-sm font-semibold">
              What needs to be connected
            </h2>
          </div>
          <ul className="space-y-3">
            {needs.map((need) => (
              <li
                key={need}
                className="flex gap-3 text-xs leading-5 text-muted-foreground"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-300" />
                {need}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border bg-background p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Once connected</h2>
            <Badge>Planned capabilities</Badge>
          </div>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex gap-3 text-xs leading-5 text-muted-foreground"
              >
                <Check size={14} className="mt-0.5 shrink-0 text-slate-300" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
