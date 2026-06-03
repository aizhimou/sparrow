import { MantineProvider, localStorageColorSchemeManager } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import type { ReactNode } from 'react';
import { AuthProvider } from '../auth/AuthProvider';
import { queryClient } from '../queryClient';
import { theme } from '../theme';

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'frontend-template-color-scheme',
});

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MantineProvider
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="auto"
      theme={theme}
    >
      <Notifications position="bottom-right" />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
