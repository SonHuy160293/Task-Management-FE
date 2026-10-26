import type { ReactNode } from 'react';

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.035em] sm:text-[32px]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action && <div className="pt-6">{action}</div>}
    </div>
  );
}
