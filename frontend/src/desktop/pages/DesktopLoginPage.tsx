import { Button, Center, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import { IconLogin } from '@tabler/icons-react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../app/auth/useAuth';

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

export function DesktopLoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const state = location.state as LoginLocationState | null;
  const from = state?.from?.pathname ?? '/home';

  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleDemoSignIn() {
    setIsSigningIn(true);
    try {
      await auth.signInDemo();
      navigate(from, { replace: true });
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <Center mih="100vh" p="xl">
      <Paper withBorder radius="md" p="xl" w={420}>
        <Stack>
          <Stack gap={4}>
            <Title order={2}>Sign in</Title>
            <Text c="dimmed" size="sm">
              Use the demo account to enter the protected area.
            </Text>
          </Stack>

          <TextInput label="Email" value="demo@example.com" readOnly />
          <PasswordInput label="Password" value="password" readOnly />

          <Button
            leftSection={<IconLogin size={16} />}
            loading={isSigningIn}
            onClick={handleDemoSignIn}
          >
            Demo sign in
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
}
