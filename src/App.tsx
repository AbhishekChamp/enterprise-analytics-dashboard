import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/layout/theme-provider';
import { useSimulation } from './hooks/use-simulation';
import { ErrorBoundary } from './components/error-boundary';
import { PerformanceMonitor } from './components/performance-monitor';
import './app/globals.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

const router = createRouter({ 
  routeTree,
  context: {
    queryClient,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function SimulationWrapper({ children }: { children: React.ReactNode }) {
  useSimulation();
  return <>{children}</>;
}

// Enable performance monitoring in development
const ENABLE_PERFORMANCE_MONITOR = import.meta.env.DEV;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ErrorBoundary name="App">
          <SimulationWrapper>
            <RouterProvider router={router} />
            <PerformanceMonitor enabled={ENABLE_PERFORMANCE_MONITOR} />
          </SimulationWrapper>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
