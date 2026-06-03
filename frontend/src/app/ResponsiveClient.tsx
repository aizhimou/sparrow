import { useMediaQuery } from '@mantine/hooks';
import type { ReactNode } from 'react';

type ResponsiveClientProps = {
  desktop: ReactNode;
  mobile: ReactNode;
};

export function ResponsiveClient({ desktop, mobile }: ResponsiveClientProps) {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return isMobile ? mobile : desktop;
}
