import { Navigate, Route, Routes } from 'react-router';
import { RequireAuth } from './auth/RequireAuth';
import { DesktopHomePage } from '../desktop/pages/DesktopHomePage';
import { DesktopLoginPage } from '../desktop/pages/DesktopLoginPage';
import { DesktopShell } from '../desktop/shell/DesktopShell';
import { MobileHomePage } from '../mobile/pages/MobileHomePage';
import { MobileLoginPage } from '../mobile/pages/MobileLoginPage';
import { MobileShell } from '../mobile/shell/MobileShell';
import { ForbiddenPage } from '../shared/pages/ForbiddenPage';
import { NotFoundPage } from '../shared/pages/NotFoundPage';
import { ResponsiveClient } from './ResponsiveClient';

export function App() {
  return (
    <Routes>
      <Route
        path="login"
        element={<ResponsiveClient desktop={<DesktopLoginPage />} mobile={<MobileLoginPage />} />}
      />

      <Route element={<RequireAuth />}>
        <Route element={<ResponsiveClient desktop={<DesktopShell />} mobile={<MobileShell />} />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route
            path="home"
            element={<ResponsiveClient desktop={<DesktopHomePage />} mobile={<MobileHomePage />} />}
          />
        </Route>
      </Route>

      <Route path="403" element={<ForbiddenPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
