import { Building2, Plus } from 'lucide-react';
import { PageHeading } from '@/components/common/page-heading';
import { Button } from '@/components/ui/button';
import { IntegrationPending } from '@/components/common/integration-pending';

export default function OrganizationsPage() {
  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE / ORGANIZATIONS"
        title="Organizations"
        description="A home for your company, its people, and shared workspaces."
        action={
          <Button disabled aria-describedby="organization-unavailable">
            <Plus />
            Create organization
          </Button>
        }
      />
      <p id="organization-unavailable" className="sr-only">
        Organization creation requires authentication and organization APIs that
        are not implemented by the backend.
      </p>
      <IntegrationPending
        icon={<Building2 size={26} />}
        title="Your organizations will live here"
        description="Organization management is awaiting backend support. When connected, this page will show only organizations your account can access."
        needs={[
          'Login and current-user session endpoints',
          'Authorized organization list, detail, and lifecycle endpoints',
          'Membership and effective permissions at the active scope',
        ]}
        features={[
          'Create and manage organization workspaces',
          'Switch between your authorized organizations',
          'Review members and act within your permissions',
        ]}
      />
    </>
  );
}
