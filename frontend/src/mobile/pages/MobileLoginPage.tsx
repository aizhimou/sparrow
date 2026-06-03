import { Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconLogin } from '@tabler/icons-react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../app/auth/useAuth';

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

export function MobileLoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const from = state?.from?.pathname ?? '/home';

  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  function handleDemoSignIn() {
    auth.signInDemo();
    navigate(from, { replace: true });
  }

  return (
    <Stack p="md" mih="100vh" justify="center">
      <Paper withBorder radius="md" p="lg">
        <Stack>
          <Stack gap={4}>
            <Title order={2}>Sign in</Title>
            <Text c="dimmed" size="sm">
              Demo login for protected mobile pages.
            </Text>
          </Stack>

          <TextInput label="Email" value="demo@example.com" readOnly />
          <PasswordInput label="Password" value="demo-password" readOnly />

          <Button leftSection={<IconLogin size={16} />} onClick={handleDemoSignIn} fullWidth>
            Demo sign in
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
