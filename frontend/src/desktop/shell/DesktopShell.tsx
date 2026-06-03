import {
  ActionIcon,
  AppShell,
  Badge,
  Button,
  Group,
  NavLink,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { IconFolder, IconLogin, IconLogout, IconMoon, IconSun } from '@tabler/icons-react';
import { NavLink as RouterNavLink, Outlet } from 'react-router';
import { useAuth } from '../../app/auth/useAuth';
import classes from './DesktopShell.module.css';

export function DesktopShell() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const auth = useAuth();
  const isDark = colorScheme === 'dark';

  return (
    <AppShell
      className={classes.root}
      header={{ height: 56 }}
      navbar={{ width: 260, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Title order={4}>Frontend Template</Title>
            <Badge variant="light">Desktop</Badge>
          </Group>

          <Group gap="xs">
            <Tooltip label={isDark ? 'Use light mode' : 'Use dark mode'}>
              <ActionIcon
                variant="default"
                aria-label="Toggle color scheme"
                onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
              >
                {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>

            {auth.isAuthenticated ? (
              <Button
                variant="default"
                leftSection={<IconLogout size={16} />}
                onClick={auth.signOut}
              >
                Sign out
              </Button>
            ) : (
              <Button leftSection={<IconLogin size={16} />} onClick={auth.signInDemo}>
                Demo sign in
              </Button>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <NavLink
          className={classes.navLink}
          component={RouterNavLink}
          to="/home"
          label="Home"
          leftSection={<IconFolder size={18} />}
        />

        <Text size="xs" c="dimmed" mt="auto" p="sm">
          {auth.user ? auth.user.email : 'Not signed in'}
        </Text>
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
