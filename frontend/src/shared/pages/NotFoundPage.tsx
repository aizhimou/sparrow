import { Button, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <Stack align="flex-start">
      <Title order={2}>Page not found</Title>
      <Text c="dimmed">The page you requested does not exist.</Text>
      <Button component={Link} to="/home">
        Back home
      </Button>
    </Stack>
  );
}
