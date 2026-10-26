import { Component, type ReactNode } from 'react';
import { ErrorState } from '@/components/common/states';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="mx-auto max-w-xl p-8">
          <ErrorState
            title="Something went wrong"
            message="Reload the application to recover. If this continues, check the troubleshooting guide."
            retry={() => window.location.reload()}
          />
        </main>
      );
    return this.props.children;
  }
}
