import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

// Check if user has "authenticated" through the landing page
export function useAuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const hasExplored = localStorage.getItem('hasExploredApp');
    const currentPath = location.pathname;
    
    // List of public routes that don't require authentication
    const publicRoutes = ['/landing', '/about'];
    const isPublicRoute = publicRoutes.includes(currentPath);
    
    // If user hasn't explored and tries to access a protected route, redirect to landing
    if (!hasExplored && !isPublicRoute) {
      navigate({ to: '/landing' });
    }
  }, [navigate, location.pathname]);
}

// Hook to mark user as having explored the app
export function useMarkExplored() {
  const markExplored = () => {
    localStorage.setItem('hasExploredApp', 'true');
  };
  
  const clearExplored = () => {
    localStorage.removeItem('hasExploredApp');
  };
  
  return { markExplored, clearExplored };
}
