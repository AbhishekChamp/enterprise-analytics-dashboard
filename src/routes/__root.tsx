import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { Layout } from '@/components/layout';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '@/hooks/use-theme';

function RootComponent() {
  const location = useLocation();
  const isPublicRoute = location.pathname === '/landing' || location.pathname === '/about';
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const toastOptions = {
    duration: 4000,
    style: {
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#f8fafc' : '#0f172a',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    },
  };

  if (isPublicRoute) {
    return (
      <>
        <Outlet />
        <Toaster 
          position="top-center"
          toastOptions={toastOptions}
        />
      </>
    );
  }

  return (
    <Layout>
      <Outlet />
      <Toaster 
        position="top-center"
        toastOptions={toastOptions}
      />
    </Layout>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
