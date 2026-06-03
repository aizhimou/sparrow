import { Paper, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Paper withBorder p="xl" radius="md">
      <Stack align="center" gap="sm">
        <Title order={3}>{title}</Title>
        {description ? (
          <Text c="dimmed" ta="center" maw={520}>
            {description}
          </Text>
        ) : null}
        {action}
      </Stack>
    </Paper>
  );
}
