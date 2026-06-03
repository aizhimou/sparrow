import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './global.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './app/providers/AppProviders';
import { App } from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
