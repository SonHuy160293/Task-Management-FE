import { Check, CircleDashed, ExternalLink, PlugZap } from 'lucide-react';
import { PageHeading } from '@/components/common/page-heading';
import { Badge } from '@/components/ui/badge';
import { config } from '@/config/env';
import { contractReviewDate } from '@/config/capabilities';

export default function SettingsPage() {
  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE / SETTINGS"
        title="Integration readiness"
        description="A transparent view of what is connected and what comes next."
      />
      <section className="mb-6 rounded-xl border bg-background p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary">
              <PlugZap size={21} />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Identity API connection</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Requests use the configured shared HTTP client.
              </p>
            </div>
          </div>
          <Badge>Build configuration</Badge>
        </div>
        <dl className="mt-6 grid gap-5 border-t pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">API base URL</dt>
            <dd className="mt-2 break-all font-mono text-sm">
              {config.apiBaseUrl}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Request timeout</dt>
            <dd className="mt-2 text-sm font-medium">15 seconds</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Contract reviewed</dt>
            <dd className="mt-2 text-sm font-medium">{contractReviewDate}</dd>
          </div>
        </dl>
        <p className="mt-5 text-xs leading-6 text-muted-foreground">
          Configure VITE_API_BASE_URL before building. In development, /api is
          proxied to DEV_API_PROXY_TARGET (defaults to localhost:8081). This
          configuration summary does not perform a live health check.
        </p>
      </section>
      <section className="overflow-hidden rounded-xl border bg-background">
        <div className="border-b px-6 py-5">
          <h2 className="text-sm font-semibold">Capability inventory</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Verified against runtime Swagger and source; planned API task cards
            are tracked separately.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Capability</th>
                <th className="px-6 py-3 font-medium">Frontend status</th>
                <th className="px-6 py-3 font-medium">Backend status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                [
                  'Account registration',
                  'Implemented',
                  'Endpoint verified',
                  true,
                ],
                [
                  'Login & session lifecycle',
                  'Infrastructure ready',
                  'Endpoints missing',
                  false,
                ],
                [
                  'Organizations & memberships',
                  'Availability page',
                  'Endpoints missing',
                  false,
                ],
                [
                  'Scoped authorization',
                  'Deny by default',
                  'Permission endpoint missing',
                  false,
                ],
                [
                  'Teams & team members',
                  'Availability page',
                  'Contracts missing',
                  false,
                ],
              ].map(([name, frontend, backend, available]) => (
                <tr key={String(name)}>
                  <th scope="row" className="px-6 py-5 font-medium">
                    {String(name)}
                  </th>
                  <td className="px-6 py-5 text-muted-foreground">
                    {String(frontend)}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-2 ${available ? 'text-emerald-700' : 'text-slate-500'}`}
                    >
                      {available ? (
                        <Check size={14} />
                      ) : (
                        <CircleDashed size={14} />
                      )}
                      {String(backend)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="mt-6 rounded-xl border border-dashed p-5">
        <h2 className="text-xs font-semibold">Working on the backend?</h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Start with docs/backend-integration-gaps.md and
          docs/api-integration.md in this repository. After publishing a
          contract, pull Swagger, regenerate types, and connect the feature.
        </p>
        <a
          href="https://swagger.io/specification/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary"
        >
          About OpenAPI
          <ExternalLink size={12} />
        </a>
      </div>
    </>
  );
}
