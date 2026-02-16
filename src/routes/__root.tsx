import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { Layout } from '@/components/layout';
import { Toaster } from 'react-hot-toast';

function RootComponent() {
  const location = useLocation();
  const isPublicRoute = location.pathname === '/landing' || location.pathname === '/about';

  if (isPublicRoute) {
    return (
      <>
        <Outlet />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </>
    );
  }

  return (
    <Layout>
      <Outlet />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </Layout>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
