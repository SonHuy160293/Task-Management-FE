import { Link } from 'react-router-dom';
import { LockKeyhole, ArrowLeft } from 'lucide-react';
import { EmptyState } from '@/components/common/states';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <EmptyState
        icon={<LockKeyhole />}
        title="Sign-in is awaiting backend support"
        description="The current Identity API supports registration. Login, session restoration, refresh, and logout endpoints are not available yet. Your account details cannot be used to start a session in this release."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              role="link"
              nativeButton={false}
              render={<Link to="/register" />}
            >
              Create an account
            </Button>
            <Button
              role="link"
              nativeButton={false}
              variant="outline"
              render={<Link to="/" />}
            >
              <ArrowLeft />
              Back to workspace
            </Button>
          </div>
        }
      />
      <p className="mt-4 text-center text-xs text-muted-foreground">
        No login request is sent until a verified contract is connected.
      </p>
    </main>
  );
}
