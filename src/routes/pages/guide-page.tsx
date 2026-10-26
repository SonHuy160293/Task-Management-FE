import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, LifeBuoy, Terminal } from 'lucide-react';
import { PageHeading } from '@/components/common/page-heading';
import { Button } from '@/components/ui/button';

export default function GuidePage() {
  return (
    <>
      <PageHeading
        eyebrow="LEARN / GETTING STARTED"
        title="Make yourself at home."
        description="A practical starting point for your workspace and the code behind it."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border bg-background p-6">
          <BookOpen className="mb-5 size-7 text-primary" />
          <h2 className="text-lg font-semibold">Start with your account</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Create an account through the registration page. This release
            supports registration requests; signing in and connecting a
            workspace depend on upcoming backend endpoints.
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
        </section>
        <section className="rounded-xl border bg-background p-6">
          <Terminal className="mb-5 size-7 text-primary" />
          <h2 className="text-lg font-semibold">Run the frontend locally</h2>
          <pre className="mt-4 overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-7 text-slate-200">
            <code>
              {
                'npm ci\nCopy-Item .env.development.example .env.development\nnpm run dev'
              }
            </code>
          </pre>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Use Node 24.21.0. The development server opens on
            http://127.0.0.1:5173. The default Identity proxy target is
            http://localhost:8081.
          </p>
        </section>
        <section className="rounded-xl border bg-background p-6">
          <Code2 className="mb-5 size-7 text-primary" />
          <h2 className="text-lg font-semibold">
            A learning path for backend developers
          </h2>
          <ol className="mt-4 list-decimal space-y-3 pl-4 text-sm text-muted-foreground">
            <li>Read docs/getting-started.md and frontend-fundamentals.md.</li>
            <li>Explore react-and-typescript.md and styling-guide.md.</li>
            <li>
              Follow architecture.md, state-management.md, and
              api-integration.md.
            </li>
            <li>
              Use feature-development-guide.md to build your next feature.
            </li>
          </ol>
        </section>
        <section className="rounded-xl border bg-background p-6">
          <LifeBuoy className="mb-5 size-7 text-primary" />
          <h2 className="text-lg font-semibold">When something goes wrong</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Open your browser’s Developer Tools. Inspect the Console for
            rendering errors and Network for API responses. A 401 needs a
            session; a 403 means the backend denied access.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The troubleshooting guide at docs/debugging-guide.md walks through
            connection, validation, cache, routing, and Docker problems.
          </p>
          <Link
            to="/settings"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Check integration readiness
            <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </>
  );
}
