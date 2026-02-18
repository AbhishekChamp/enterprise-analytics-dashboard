import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
    Bell,
    Settings,
    Sun,
    Moon,
    LogOut,
    Keyboard,
    Share2,
    DollarSign,
    Zap,
    FileJson,
    Database,
    Building2,
} from "lucide-react";
import { cn } from "@/utils/formatting";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/app-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help";
import { SearchBar } from "@/components/search-bar";
import { Footer } from "./Footer";
import { OnboardingTour } from "@/components/onboarding-tour";
import { ConnectionStatus } from "@/components/connection-status";
import { GlobalSearch } from "@/components/global-search";
import toast from "react-hot-toast";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, shortcut: "g+d" },
    { name: "Pipelines", href: "/pipelines", icon: GitBranch, shortcut: "g+p" },
    {
        name: "API Monitoring",
        href: "/api-monitoring",
        icon: Activity,
        shortcut: "g+a",
    },
    {
        name: "Data Freshness",
        href: "/freshness",
        icon: Clock,
        shortcut: "g+f",
    },
    {
        name: "Segmentation",
        href: "/segmentation",
        icon: Users,
        shortcut: "g+s",
    },
    {
        name: "Incidents",
        href: "/incidents",
        icon: AlertCircle,
        shortcut: "g+i",
    },
];

const deNavigation = [
    { name: "Data Lineage", href: "/lineage", icon: Share2, shortcut: "g+l" },
    { name: "Cost Analytics", href: "/cost-analytics", icon: DollarSign, shortcut: "g+c" },
    { name: "Query Performance", href: "/query-performance", icon: Zap, shortcut: "g+q" },
    { name: "Schema Registry", href: "/schema-registry", icon: FileJson, shortcut: "g+r" },
    { name: "Streaming", href: "/streaming", icon: Database, shortcut: "g+t" },
    { name: "Data Mesh", href: "/data-mesh", icon: Building2, shortcut: "g+m" },
];

interface SidebarContentProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    currentUser: { role: string };
    setRole: (role: "ADMIN" | "VIEWER") => void;
    isSimulationActive: boolean;
    toggleSimulation: () => void;
    location: { pathname: string };
    setMobileOpen?: (open: boolean) => void;
}

const SidebarContent = ({
    collapsed,
    setCollapsed,
    currentUser,
    setRole,
    isSimulationActive,
    toggleSimulation,
    location,
    setMobileOpen,
}: SidebarContentProps) => (
    <>
        <div className='flex h-16 items-center justify-between px-4 border-b border-border'>
            <div
                className={cn(
                    "flex items-center gap-2",
                    collapsed && "justify-center",
                )}
            >
                <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                    <Activity className='h-5 w-5 text-primary-foreground' />
                </div>
                {!collapsed && (
                    <span className='text-lg font-semibold'>DataOps</span>
                )}
            </div>
            {!collapsed && (
                <button
                    onClick={() => setCollapsed(true)}
                    className='hidden lg:flex p-1 rounded-md hover:bg-accent cursor-pointer'
                >
                    <ChevronLeft className='h-4 w-4' />
                </button>
            )}
        </div>

        <div className='flex-1 overflow-auto py-4'>
            <nav className='space-y-1 px-2'>
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                collapsed && "justify-center px-2",
                            )}
                            onClick={() => setMobileOpen?.(false)}
                        >
                            <item.icon className='h-5 w-5 shrink-0' />
                            {!collapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {!collapsed && (
                <div className="mt-6 px-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                        Data Engineering
                    </p>
                </div>
            )}
            
            <nav className='space-y-1 px-2 mt-2'>
                {deNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                collapsed && "justify-center px-2",
                            )}
                            onClick={() => setMobileOpen?.(false)}
                        >
                            <item.icon className='h-5 w-5 shrink-0' />
                            {!collapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>
        </div>

        {!collapsed && (
            <div className='border-t border-border p-4 space-y-4'>
                <div className='space-y-2'>
                    <label className='text-xs font-medium text-muted-foreground'>
                        Role
                    </label>
                    <select
                        value={currentUser.role}
                        onChange={(e) =>
                            setRole(e.target.value as "ADMIN" | "VIEWER")
                        }
                        className='w-full px-2 py-1 text-sm border rounded bg-background cursor-pointer'
                    >
                        <option value='ADMIN'>Admin</option>
                        <option value='VIEWER'>Viewer</option>
                    </select>
                </div>

                <div className='space-y-2'>
                    <label className='text-xs font-medium text-muted-foreground'>
                        Simulation
                    </label>
                    <button
                        onClick={toggleSimulation}
                        className={cn(
                            "w-full px-2 py-1 text-sm rounded transition-colors cursor-pointer",
                            isSimulationActive
                                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                : "bg-red-500/10 text-red-600 border border-red-500/20",
                        )}
                    >
                        {isSimulationActive ? "Active" : "Paused"}
                    </button>
                </div>
            </div>
        )}

        {collapsed && (
            <div className='border-t border-border p-2'>
                <button
                    onClick={() => setCollapsed(false)}
                    className='w-full flex justify-center p-1 rounded-md hover:bg-accent cursor-pointer'
                >
                    <ChevronRight className='h-4 w-4' />
                </button>
            </div>
        )}
    </>
);

export const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { currentUser, setRole, isSimulationActive, toggleSimulation } =
        useAppStore();

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className='lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border border-border shadow-sm cursor-pointer'
            >
                {mobileOpen ? (
                    <X className='h-5 w-5' />
                ) : (
                    <Menu className='h-5 w-5' />
                )}
            </button>

            {/* Mobile sidebar */}
            {mobileOpen && (
                <div className='lg:hidden fixed inset-0 z-40' role="dialog" aria-modal="true" aria-label="Mobile navigation">
                    <div
                        className='absolute inset-0 bg-black/50'
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />
                    <div className='absolute left-0 top-0 h-full w-64 bg-background border-r border-border flex flex-col'>
                        <SidebarContent
                            collapsed={false}
                            setCollapsed={setCollapsed}
                            currentUser={currentUser}
                            setRole={setRole}
                            isSimulationActive={isSimulationActive}
                            toggleSimulation={toggleSimulation}
                            location={location}
                            setMobileOpen={setMobileOpen}
                        />
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex flex-col h-screen bg-background border-r border-border transition-all duration-300",
                    collapsed ? "w-16" : "w-64",
                )}
                role="navigation"
                aria-label="Main navigation"
                data-tour="sidebar"
            >
                <SidebarContent
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    currentUser={currentUser}
                    setRole={setRole}
                    isSimulationActive={isSimulationActive}
                    toggleSimulation={toggleSimulation}
                    location={location}
                />
            </aside>
        </>
    );
};

// Toggle Switch Component
const ToggleSwitch = ({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: () => void;
}) => (
    <button
        onClick={onChange}
        className={cn(
            "w-11 h-6 rounded-full relative transition-colors duration-200 cursor-pointer",
            checked ? "bg-primary" : "bg-muted",
        )}
    >
        <span
            className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200",
                checked ? "right-1" : "left-1",
            )}
        />
    </button>
);

// Notification Panel Component
const NotificationPanel = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Pipeline Failed",
            message: "payment-etl pipeline failed",
            time: "2 min ago",
            type: "error",
            read: false,
            link: "/pipelines/pipe-003",
        },
        {
            id: 2,
            title: "High Error Rate",
            message: "API error rate exceeded threshold",
            time: "15 min ago",
            type: "warning",
            read: false,
            link: "/api-monitoring",
        },
        {
            id: 3,
            title: "SLA Breach",
            message: "Data freshness SLA breached",
            time: "1 hour ago",
            type: "error",
            read: true,
            link: "/freshness",
        },
    ]);

    const handleNotificationClick = (
        notification: (typeof notifications)[0],
    ) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notification.id ? { ...n, read: true } : n,
            ),
        );
        navigate({ to: notification.link });
        onClose();
    };

    const handleViewAll = () => {
        navigate({ to: "/incidents" });
        onClose();
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (!isOpen) return null;

    return (
        <div className='absolute right-0 top-14 w-80 bg-background border border-border rounded-lg shadow-lg z-50'>
            <div className='flex items-center justify-between p-4 border-b border-border'>
                <div className='flex items-center gap-2'>
                    <h3 className='font-semibold'>Notifications</h3>
                    {unreadCount > 0 && (
                        <span className='bg-red-500 text-white text-xs px-2 py-0.5 rounded-full'>
                            {unreadCount}
                        </span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className='p-1 hover:bg-accent rounded cursor-pointer'
                >
                    <X className='h-4 w-4' />
                </button>
            </div>
            <div className='max-h-96 overflow-y-auto'>
                {notifications.length === 0 ? (
                    <div className='p-8 text-center text-muted-foreground'>
                        <Bell className='h-8 w-8 mx-auto mb-2 opacity-50' />
                        <p>No notifications</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
                            className={cn(
                                "p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors",
                                !notification.read && "bg-accent/20",
                            )}
                        >
                            <div className='flex items-start gap-3'>
                                <div
                                    className={cn(
                                        "w-2 h-2 rounded-full mt-2 shrink-0",
                                        notification.type === "error"
                                            ? "bg-red-500"
                                            : "bg-yellow-500",
                                    )}
                                />
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2'>
                                        <p
                                            className={cn(
                                                "font-medium text-sm",
                                                !notification.read &&
                                                    "text-foreground",
                                            )}
                                        >
                                            {notification.title}
                                        </p>
                                        {!notification.read && (
                                            <span className='w-2 h-2 bg-blue-500 rounded-full shrink-0' />
                                        )}
                                    </div>
                                    <p className='text-sm text-muted-foreground'>
                                        {notification.message}
                                    </p>
                                    <p className='text-xs text-muted-foreground mt-1'>
                                        {notification.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className='p-3 border-t border-border flex items-center justify-between'>
                <button
                    onClick={() =>
                        setNotifications((prev) =>
                            prev.map((n) => ({ ...n, read: true })),
                        )
                    }
                    className='text-sm text-muted-foreground hover:text-foreground cursor-pointer'
                >
                    Mark all as read
                </button>
                <button
                    onClick={handleViewAll}
                    className='text-sm text-primary hover:underline cursor-pointer'
                >
                    View all
                </button>
            </div>
        </div>
    );
};

// Settings Panel Component
const SettingsPanel = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { themeMode, setThemeMode, theme } = useTheme();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        slackIntegration: false,
        autoRefresh: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSignOut = () => {
        toast.success("Signed out successfully");
        onClose();
        // Clear the explored flag so user must go through landing page again
        localStorage.removeItem('hasExploredApp');
        localStorage.removeItem('userRole');
        // Use window.location for a full page redirect to ensure navigation works
        setTimeout(() => {
            window.location.href = "/landing";
        }, 100);
    };

    if (!isOpen) return null;

    return (
        <div className='absolute right-0 top-14 w-80 bg-background border border-border rounded-lg shadow-lg z-50'>
            <div className='flex items-center justify-between p-4 border-b border-border'>
                <h3 className='font-semibold'>Settings</h3>
                <button
                    onClick={onClose}
                    className='p-1 hover:bg-accent rounded cursor-pointer'
                >
                    <X className='h-4 w-4' />
                </button>
            </div>
            <div className='p-4 space-y-4'>
                {/* Theme Settings */}
                <div className='space-y-2'>
                    <label className='text-xs font-medium text-muted-foreground'>
                        Theme Mode
                    </label>
                    <select
                        value={themeMode}
                        onChange={(e) =>
                            setThemeMode(e.target.value as "manual" | "auto")
                        }
                        className='w-full px-2 py-1 text-sm border rounded bg-background cursor-pointer'
                    >
                        <option value='manual'>Manual</option>
                        <option value='auto'>Auto (8PM-6AM)</option>
                    </select>
                    {themeMode === "auto" && (
                        <p className='text-xs text-muted-foreground'>
                            Auto-switching:{" "}
                            {theme === "dark"
                                ? "Dark mode active"
                                : "Light mode active"}
                        </p>
                    )}
                </div>

                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-sm font-medium'>
                            Email Notifications
                        </p>
                        <p className='text-xs text-muted-foreground'>
                            Receive email alerts
                        </p>
                    </div>
                    <ToggleSwitch
                        checked={settings.emailNotifications}
                        onChange={() => toggleSetting("emailNotifications")}
                    />
                </div>
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-sm font-medium'>Slack Integration</p>
                        <p className='text-xs text-muted-foreground'>
                            Send alerts to Slack
                        </p>
                    </div>
                    <ToggleSwitch
                        checked={settings.slackIntegration}
                        onChange={() => toggleSetting("slackIntegration")}
                    />
                </div>
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-sm font-medium'>Auto-refresh</p>
                        <p className='text-xs text-muted-foreground'>
                            Auto-update dashboard
                        </p>
                    </div>
                    <ToggleSwitch
                        checked={settings.autoRefresh}
                        onChange={() => toggleSetting("autoRefresh")}
                    />
                </div>
                <div className='pt-4 border-t border-border space-y-2'>
                    <button
                        onClick={handleSignOut}
                        className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer'
                    >
                        <LogOut className='h-4 w-4' />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Header = () => {
    const { currentUser } = useAppStore();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);

    // Keyboard shortcuts
    const shortcuts = useMemo(
        () => [
            {
                key: "?",
                description: "Show keyboard shortcuts",
                action: () => setShortcutsOpen(true),
            },
            {
                key: "t",
                description: "Toggle theme",
                action: () => toggleTheme(),
            },
            {
                key: "r",
                description: "Refresh data",
                action: () => {
                    window.location.reload();
                },
            },
            ...navigation.map((nav) => ({
                key: nav.shortcut,
                description: `Go to ${nav.name}`,
                action: () => navigate({ to: nav.href }),
            })),
            ...deNavigation.map((nav) => ({
                key: nav.shortcut,
                description: `Go to ${nav.name}`,
                action: () => navigate({ to: nav.href }),
            })),
        ],
        [navigate, toggleTheme, setShortcutsOpen],
    );

    useKeyboardShortcuts(shortcuts);

    const toggleNotifications = () => {
        setNotificationsOpen(!notificationsOpen);
        setSettingsOpen(false);
    };

    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
        setNotificationsOpen(false);
    };

    return (
        <>
            <header 
                className='h-16 border-b border-border bg-background flex items-center justify-between px-6 relative'
                role="banner"
                aria-label="Dashboard Header"
            >
                <div className='flex items-center gap-4 flex-1' data-tour="search">
                    <SearchBar />
                </div>

                <div className='flex items-center gap-4'>
                    <ConnectionStatus />
                    
                    <GlobalSearch />

                    <button
                        onClick={() => setShortcutsOpen(true)}
                        className='p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer'
                        title='Keyboard shortcuts (?)'
                        aria-label="Open keyboard shortcuts"
                    >
                        <Keyboard className='h-5 w-5' aria-hidden="true" />
                    </button>

                    <button
                        onClick={toggleTheme}
                        className='p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer'
                        title={
                            theme === "light"
                                ? "Switch to dark mode (t)"
                                : "Switch to light mode (t)"
                        }
                        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    >
                        {theme === "light" ? (
                            <Moon className='h-5 w-5' aria-hidden="true" />
                        ) : (
                            <Sun className='h-5 w-5' aria-hidden="true" />
                        )}
                    </button>

                    <div className='relative' data-tour="notifications">
                        <button
                            onClick={toggleNotifications}
                            className='relative p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer'
                            aria-label="Notifications"
                            aria-haspopup="true"
                            aria-expanded={notificationsOpen}
                        >
                            <Bell className='h-5 w-5' aria-hidden="true" />
                            <span className='absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full' aria-label="New notifications" />
                        </button>
                        <NotificationPanel
                            isOpen={notificationsOpen}
                            onClose={() => setNotificationsOpen(false)}
                        />
                    </div>

                    <div className='relative' data-tour="settings">
                        <button
                            onClick={toggleSettings}
                            className='p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer'
                            aria-label="Settings"
                            aria-haspopup="true"
                            aria-expanded={settingsOpen}
                        >
                            <Settings className='h-5 w-5' aria-hidden="true" />
                        </button>
                        <SettingsPanel
                            isOpen={settingsOpen}
                            onClose={() => setSettingsOpen(false)}
                        />
                    </div>

                    <div className='flex items-center gap-3 pl-4 border-l border-border' role="group" aria-label="User profile">
                        <div className='text-right'>
                            <p className='text-sm font-medium' aria-label={`User name: ${currentUser.name}`}>
                                {currentUser.name}
                            </p>
                            <p className='text-xs text-muted-foreground' aria-label={`Role: ${currentUser.role}`}>
                                {currentUser.role}
                            </p>
                        </div>
                        <div 
                            className='h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center'
                            aria-label="User avatar"
                        >
                            <span className='text-sm font-medium text-primary' aria-hidden="true">
                                {currentUser.name.charAt(0)}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <KeyboardShortcutsHelp
                isOpen={shortcutsOpen}
                onClose={() => setShortcutsOpen(false)}
            />
        </>
    );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
    useAuthGuard();
    
    return (
        <div className='flex min-h-screen bg-background' role="main" aria-label="Dashboard Layout">
            <Sidebar />
            <div className='flex-1 flex flex-col min-w-0'>
                <Header />
                <main className='flex-1 overflow-auto p-6' role="region" aria-label="Main Content">
                    {children}
                </main>
                <Footer />
            </div>
            <OnboardingTour />
        </div>
    );
};
