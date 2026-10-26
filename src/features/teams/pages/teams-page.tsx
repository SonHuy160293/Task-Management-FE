import { UsersRound, Plus } from 'lucide-react';
import { PageHeading } from '@/components/common/page-heading';
import { Button } from '@/components/ui/button';
import { IntegrationPending } from '@/components/common/integration-pending';

export default function TeamsPage() {
  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE / TEAMS"
        title="Teams"
        description="Bring the people who plan, build, and ship together."
        action={
          <Button disabled aria-describedby="team-unavailable">
            <Plus />
            Create team
          </Button>
        }
      />
      <p id="team-unavailable" className="sr-only">
        Team creation requires an authorized organization and team endpoints
        that are not available.
      </p>
      <IntegrationPending
        icon={<UsersRound size={26} />}
        title="A space for every team"
        description="Team and membership contracts are not available yet. Connect an authorized organization and the team API before creating or managing teams."
        needs={[
          'A verified organization and an active membership',
          'Team list, detail, search, create, update, and removal contracts',
          'Team member management and exact-scope permission contracts',
        ]}
        features={[
          'Search and organize teams within a workspace',
          'Create and maintain team details',
          'Add and remove members with scoped access',
        ]}
      />
    </>
  );
}
