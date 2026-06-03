import { Alert, Button, Stack } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { getErrorMessage } from '../api/apiError';

type ErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Alert
      color="red"
      icon={<IconAlertTriangle size={18} />}
      title="Could not load data"
      variant="light"
    >
      <Stack gap="sm" align="flex-start">
        <span>{getErrorMessage(error)}</span>
        {onRetry ? (
          <Button variant="light" color="red" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </Stack>
    </Alert>
  );
}
