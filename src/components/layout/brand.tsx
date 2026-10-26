import { ChevronsLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';
import { config } from '@/config/env';

export function Brand({
  light = false,
  collapsed = false,
}: {
  light?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      to="/"
      aria-label={`${config.appName} home`}
      className={cn(
        'inline-flex w-fit items-center gap-2.5 text-[21px] font-semibold tracking-tight',
        light && 'text-white',
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
        <ChevronsLeftRight size={23} strokeWidth={2.5} />
      </span>
      {!collapsed && (
        <>
          {config.appName}
          <span className="ml-0.5 mt-0.5 size-1.5 rounded-full bg-primary" />
        </>
      )}
    </Link>
  );
}
