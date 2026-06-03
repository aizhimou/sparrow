import { Button, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router';

export function ForbiddenPage() {
  return (
    <Stack align="flex-start">
      <Title order={2}>Access denied</Title>
      <Text c="dimmed">You do not have permission to view this page.</Text>
      <Button component={Link} to="/home">
        Back home
      </Button>
    </Stack>
  );
}
