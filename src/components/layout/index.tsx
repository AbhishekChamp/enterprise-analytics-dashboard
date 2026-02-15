import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Activity,
  Clock,
  Users,
  AlertCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Settings,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { cn } from '@/utils/formatting';
import { useTheme } from './theme-provider';
import { useAppStore } from '@/store/app-store';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pipelines', href: '/pipelines', icon: GitBranch },
  { name: 'API Monitoring', href: '/api-monitoring', icon: Activity },
  { name: 'Data Freshness', href: '/freshness', icon: Clock },
  { name: 'Segmentation', href: '/segmentation', icon: Users },
  { name: 'Incidents', href: '/incidents', icon: AlertCircle },
  { name: 'About', href: '/about', icon: Info },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { currentUser, setRole, isSimulationActive, toggleSimulation } = useAppStore();

  const NavContent = () => (
    <>
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold">DataOps</span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden lg:flex p-1 rounded-md hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {!collapsed && (
        <div className="border-t border-border p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Role</label>
            <select
              value={currentUser.role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'VIEWER')}
              className="w-full px-2 py-1 text-sm border rounded bg-background"
            >
              <option value="ADMIN">Admin</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Simulation</label>
            <button
              onClick={toggleSimulation}
              className={cn(
                "w-full px-2 py-1 text-sm rounded transition-colors",
                isSimulationActive 
                  ? "bg-green-500/10 text-green-600 border border-green-500/20" 
                  : "bg-red-500/10 text-red-600 border border-red-500/20"
              )}
            >
              {isSimulationActive ? 'Active' : 'Paused'}
            </button>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="border-t border-border p-2">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex justify-center p-1 rounded-md hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border border-border shadow-sm"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-background border-r border-border flex flex-col">
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen bg-background border-r border-border transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <NavContent />
      </aside>
    </>
  );
};

export const Header = () => {
  const { currentUser } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search in pipelines
      navigate({ 
        to: '/pipelines',
        search: { q: searchQuery }
      });
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <form onSubmit={handleSearch} className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pipelines, datasets, incidents..."
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-md bg-background"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        <button className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">
          <Settings className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {currentUser.name.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
