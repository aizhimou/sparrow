import { Group, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" gap="md">
      <Stack gap={4}>
        <Title order={2}>{title}</Title>
        {description ? (
          <Text c="dimmed" size="sm">
            {description}
          </Text>
        ) : null}
      </Stack>

      {actions}
    </Group>
  );
}
