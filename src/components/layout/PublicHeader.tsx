import { Link } from "@tanstack/react-router";
import { Activity, Info } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function PublicHeader() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className='border-b border-border bg-background'>
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
                <Link to='/' className='flex items-center gap-2'>
                    <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                        <Activity className='h-5 w-5 text-primary-foreground' />
                    </div>
                    <div>
                        <h1 className='text-xl font-bold text-foreground'>
                            DataOps
                        </h1>
                        <p className='text-xs text-muted-foreground'>
                            Enterprise Analytics Dashboard
                        </p>
                    </div>
                </Link>
                <div className='flex items-center gap-4'>
                    <Link
                        to='/about'
                        className='flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent text-muted-foreground hover:text-foreground'
                    >
                        <Info className='h-5 w-5' />
                        <span className='hidden sm:inline'>About</span>
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className='p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent'
                        title={
                            theme === "light"
                                ? "Switch to dark mode"
                                : "Switch to light mode"
                        }
                    >
                        {theme === "light" ? (
                            <svg
                                className='h-5 w-5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                                />
                            </svg>
                        ) : (
                            <svg
                                className='h-5 w-5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                                />
                            </svg>
                        )}
                    </button>
                    <a
                        href='https://github.com/AbhishekChamp/enterprise-analytics-dashboard'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 transition-colors hover:text-foreground text-muted-foreground'
                    >
                        <svg
                            className='h-7 w-7 group-hover:text-primary transition-colors'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                        >
                            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                        </svg>
                        <span className='hidden sm:inline'>GitHub</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
