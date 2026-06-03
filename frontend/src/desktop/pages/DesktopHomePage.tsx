import { Badge, Button, Group, Paper, Stack, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useProjectsQuery } from '../../shared/features/projects/projectsQueries';
import type { ProjectStatus } from '../../shared/features/projects/projectsTypes';
import { EmptyState } from '../../shared/components/EmptyState';
import { ErrorState } from '../../shared/components/ErrorState';
import { LoadingState } from '../../shared/components/LoadingState';
import { PageHeader } from '../../shared/components/PageHeader';
import { DesktopProjectCreateModal } from '../components/DesktopProjectCreateModal';

const statusColors: Record<ProjectStatus, string> = {
  planning: 'blue',
  active: 'green',
  paused: 'gray',
};

export function DesktopHomePage() {
  const [createOpened, createModal] = useDisclosure(false);
  const projectsQuery = useProjectsQuery();

  const createButton = (
    <Button leftSection={<IconPlus size={16} />} onClick={createModal.open}>
      New project
    </Button>
  );

  return (
    <Stack gap="lg">
      <PageHeader
        title="Projects"
        description="Desktop example: table view, AppShell navbar, and modal mutation."
        actions={createButton}
      />

      {projectsQuery.isLoading ? <LoadingState message="Loading projects" /> : null}

      {projectsQuery.isError ? (
        <ErrorState error={projectsQuery.error} onRetry={() => projectsQuery.refetch()} />
      ) : null}

      {projectsQuery.isSuccess && projectsQuery.data.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create the first project to check the modal mutation flow."
          action={createButton}
        />
      ) : null}

      {projectsQuery.isSuccess && projectsQuery.data.length > 0 ? (
        <Paper withBorder radius="md" p={0}>
          <Table.ScrollContainer minWidth={720}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Owner</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Updated</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {projectsQuery.data.map((project) => (
                  <Table.Tr key={project.id}>
                    <Table.Td>
                      <Text fw={600}>{project.name}</Text>
                    </Table.Td>
                    <Table.Td>{project.owner}</Table.Td>
                    <Table.Td>
                      <Badge color={statusColors[project.status]} variant="light">
                        {project.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <Text size="sm">
                          {new Date(project.updatedAt).toLocaleDateString('en-NZ')}
                        </Text>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      ) : null}

      <DesktopProjectCreateModal opened={createOpened} onClose={createModal.close} />
    </Stack>
  );
}
