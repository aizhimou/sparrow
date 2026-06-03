import { ActionIcon, Badge, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useProjectsQuery } from '../../shared/features/projects/projectsQueries';
import type { ProjectStatus } from '../../shared/features/projects/projectsTypes';
import { EmptyState } from '../../shared/components/EmptyState';
import { ErrorState } from '../../shared/components/ErrorState';
import { LoadingState } from '../../shared/components/LoadingState';
import { MobileProjectCreateDrawer } from '../components/MobileProjectCreateDrawer';

const statusColors: Record<ProjectStatus, string> = {
  planning: 'blue',
  active: 'green',
  paused: 'gray',
};

export function MobileHomePage() {
  const [createOpened, createDrawer] = useDisclosure(false);
  const projectsQuery = useProjectsQuery();

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Title order={3}>Projects</Title>
          <Text c="dimmed" size="sm">
            Mobile example: card list and bottom drawer.
          </Text>
        </Stack>

        <ActionIcon size="lg" aria-label="New project" onClick={createDrawer.open}>
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      {projectsQuery.isLoading ? <LoadingState message="Loading projects" /> : null}

      {projectsQuery.isError ? (
        <ErrorState error={projectsQuery.error} onRetry={() => projectsQuery.refetch()} />
      ) : null}

      {projectsQuery.isSuccess && projectsQuery.data.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create the first project to check the drawer mutation flow."
        />
      ) : null}

      {projectsQuery.isSuccess && projectsQuery.data.length > 0 ? (
        <Stack gap="sm">
          {projectsQuery.data.map((project) => (
            <Paper key={project.id} withBorder radius="md" p="md">
              <Stack gap="xs">
                <Group justify="space-between" align="flex-start">
                  <Text fw={600}>{project.name}</Text>
                  <Badge color={statusColors[project.status]} variant="light">
                    {project.status}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  Owner: {project.owner}
                </Text>
                <Text size="xs" c="dimmed">
                  Updated {new Date(project.updatedAt).toLocaleDateString('en-NZ')}
                </Text>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : null}

      <MobileProjectCreateDrawer opened={createOpened} onClose={createDrawer.close} />
    </Stack>
  );
}
