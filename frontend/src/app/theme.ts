import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brand',
  defaultRadius: 'md',
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  colors: {
    brand: [
      '#f5f5f5',
      '#e7e7e7',
      '#cdcdcd',
      '#b2b2b2',
      '#9a9a9a',
      '#8b8b8b',
      '#848484',
      '#717171',
      '#656565',
      '#5c5c5c',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        size: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        centered: true,
      },
    },
    TextInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'sm',
      },
    },
    Select: {
      defaultProps: {
        size: 'sm',
      },
    },
  },
});
