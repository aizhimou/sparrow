import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { getErrorMessage } from '../api/apiError';

export function showSuccess(message: string) {
  notifications.show({
    title: 'Success',
    message,
    color: 'green',
    icon: <IconCheck size={16} />,
  });
}

export function showError(error: unknown, fallbackMessage = 'Request failed') {
  notifications.show({
    title: 'Error',
    message: getErrorMessage(error) || fallbackMessage,
    color: 'red',
    icon: <IconX size={16} />,
    autoClose: 7000,
  });
}
