import { Center, Loader, Stack, Text } from '@mantine/core';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Loading data' }: LoadingStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="sm">
        <Loader />
        <Text c="dimmed" size="sm">
          {message}
        </Text>
      </Stack>
    </Center>
  );
}
