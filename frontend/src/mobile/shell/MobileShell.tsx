import {
  ActionIcon,
  AppShell,
  Group,
  NavLink,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { IconFolder, IconMoon, IconSun } from '@tabler/icons-react';
import { NavLink as RouterNavLink, Outlet } from 'react-router';
import classes from './MobileShell.module.css';

export function MobileShell() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <AppShell header={{ height: 52 }} footer={{ height: 58 }} padding="sm">
      <AppShell.Header>
        <Group h="100%" px="sm" justify="space-between">
          <Title order={4}>Template</Title>

          <Tooltip label={isDark ? 'Use light mode' : 'Use dark mode'}>
            <ActionIcon
              variant="default"
              aria-label="Toggle color scheme"
              onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
            >
              {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>

      <AppShell.Main className={classes.main}>
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer className={classes.bottomNav} p={4}>
        <NavLink
          component={RouterNavLink}
          to="/home"
          label={<Text size="xs">Home</Text>}
          leftSection={<IconFolder size={18} />}
        />
      </AppShell.Footer>
    </AppShell>
  );
}
