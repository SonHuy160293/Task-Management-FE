import { AlertCircle, LoaderCircle, LockKeyhole } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export function LoadingState({
  message = 'Loading your workspace…',
}: {
  message?: string;
}) {
  return (
    <div
      role="status"
      className="flex min-h-48 items-center justify-center gap-3 text-sm text-muted-foreground"
    >
      <LoaderCircle className="size-5 animate-spin" />
      {message}
    </div>
  );
}

export function ErrorState({
  title = 'We couldn’t load this page',
  message,
  retry,
}: {
  title?: string;
  message: string;
  retry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6"
    >
      <AlertCircle className="mb-3 size-6 text-red-600" />
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {retry && (
        <Button className="mt-4" variant="outline" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-background px-6 py-12 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        {icon}
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ForbiddenState() {
  return (
    <EmptyState
      icon={<LockKeyhole />}
      title="You don’t have access to this workspace"
      description="Your membership or permissions may have changed. Select an organization you can access, or contact its administrator."
    />
  );
}
