import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResult {
    id: string;
    type: "pipeline" | "dataset" | "incident" | "api" | "page";
    title: string;
    description: string;
    href: string;
    icon?: string;
}

interface SavedSearch {
    id: string;
    query: string;
    timestamp: number;
}

export function GlobalSearch() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("savedSearches");
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // Mock search results - in real app, this would search across all data
    const mockResults: SearchResult[] = [
        {
            id: "1",
            type: "pipeline",
            title: "ETL Customer Data",
            description: "Daily customer data ingestion pipeline",
            href: "/pipelines/1",
        },
        {
            id: "2",
            type: "pipeline",
            title: "Product Analytics",
            description: "Product metrics aggregation pipeline",
            href: "/pipelines/2",
        },
        {
            id: "3",
            type: "dataset",
            title: "user_events",
            description: "User interaction events table",
            href: "/freshness",
        },
        {
            id: "4",
            type: "incident",
            title: "Pipeline Failure #1234",
            description: "ETL timeout error at 14:30",
            href: "/incidents",
        },
        {
            id: "5",
            type: "page",
            title: "API Monitoring",
            description: "View API performance metrics",
            href: "/api-monitoring",
        },
        {
            id: "6",
            type: "page",
            title: "Segmentation",
            description: "User segmentation analytics",
            href: "/segmentation",
        },
    ];

    const filteredResults =
        query.length > 0
            ? mockResults.filter(
                  (result) =>
                      result.title
                          .toLowerCase()
                          .includes(query.toLowerCase()) ||
                      result.description
                          .toLowerCase()
                          .includes(query.toLowerCase()),
              )
            : [];

    const saveSearch = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) return;

        const newSearch: SavedSearch = {
            id: Date.now().toString(),
            query: searchQuery,
            timestamp: Date.now(),
        };

        setSavedSearches((prev) => {
            // Remove duplicates and keep only last 10
            const filtered = prev.filter((s) => s.query !== searchQuery);
            const updated = [newSearch, ...filtered].slice(0, 10);
            localStorage.setItem("savedSearches", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const handleSearch = (searchQuery: string) => {
        saveSearch(searchQuery);
        setIsOpen(false);
        setQuery("");
        navigate({ to: "/search", search: { q: searchQuery } });
    };

    const clearSavedSearches = () => {
        setSavedSearches([]);
        localStorage.removeItem("savedSearches");
    };

    const removeSavedSearch = (id: string) => {
        setSavedSearches((prev) => {
            const updated = prev.filter((s) => s.id !== id);
            localStorage.setItem("savedSearches", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <>
            {/* Search Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className='flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors'
            >
                <Search className='h-4 w-4' />
                <span className='hidden sm:inline'>Search...</span>
                <kbd className='hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium'>
                    /
                </kbd>
            </button>

            {/* Search Modal */}
            {isOpen && (
                <>
                    <div
                        className='fixed inset-0 bg-black/50 z-50'
                        onClick={() => setIsOpen(false)}
                    />
                    <div className='fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-150 max-h-[80vh] bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden'>
                        {/* Search Input */}
                        <div className='flex items-center gap-3 p-4 border-b border-border'>
                            <Search className='h-5 w-5 text-muted-foreground' />
                            <input
                                type='text'
                                placeholder='Search pipelines, datasets, incidents...'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className='flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground'
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && query) {
                                        handleSearch(query);
                                    }
                                    if (e.key === "Escape") {
                                        setIsOpen(false);
                                    }
                                }}
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className='p-1 hover:bg-muted rounded'
                                >
                                    <X className='h-4 w-4' />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className='text-xs text-muted-foreground hover:text-foreground'
                            >
                                ESC
                            </button>
                        </div>

                        {/* Results */}
                        <div className='overflow-y-auto max-h-[60vh]'>
                            {query.length > 0 ? (
                                <div className='p-2'>
                                    <div className='text-xs font-medium text-muted-foreground px-3 py-2'>
                                        Results
                                    </div>
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => {
                                                    saveSearch(query);
                                                    setIsOpen(false);
                                                    navigate({
                                                        to: result.href,
                                                    });
                                                }}
                                                className='w-full flex items-start gap-3 px-3 py-2.5 hover:bg-muted rounded-lg text-left transition-colors'
                                            >
                                                <div className='p-2 bg-primary/10 rounded-lg'>
                                                    <Sparkles className='h-4 w-4 text-primary' />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='font-medium text-sm'>
                                                            {result.title}
                                                        </span>
                                                        <span className='text-xs text-muted-foreground capitalize px-1.5 py-0.5 bg-muted rounded'>
                                                            {result.type}
                                                        </span>
                                                    </div>
                                                    <p className='text-xs text-muted-foreground truncate'>
                                                        {result.description}
                                                    </p>
                                                </div>
                                                <ArrowRight className='h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100' />
                                            </button>
                                        ))
                                    ) : (
                                        <div className='px-3 py-8 text-center'>
                                            <p className='text-sm text-muted-foreground'>
                                                No results found for "{query}"
                                            </p>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='mt-2'
                                                onClick={() =>
                                                    handleSearch(query)
                                                }
                                            >
                                                View all results
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className='p-2'>
                                    {/* Recent Searches */}
                                    {savedSearches.length > 0 && (
                                        <>
                                            <div className='flex items-center justify-between px-3 py-2'>
                                                <span className='text-xs font-medium text-muted-foreground'>
                                                    Recent Searches
                                                </span>
                                                <button
                                                    onClick={clearSavedSearches}
                                                    className='text-xs text-muted-foreground hover:text-foreground'
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                            {savedSearches
                                                .slice(0, 5)
                                                .map((search) => (
                                                    <div
                                                        key={search.id}
                                                        className='flex items-center justify-between px-3 py-2 hover:bg-muted rounded-lg group'
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                handleSearch(
                                                                    search.query,
                                                                )
                                                            }
                                                            className='flex items-center gap-3 flex-1 text-left'
                                                        >
                                                            <Clock className='h-4 w-4 text-muted-foreground' />
                                                            <span className='text-sm'>
                                                                {search.query}
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                removeSavedSearch(
                                                                    search.id,
                                                                )
                                                            }
                                                            className='opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded'
                                                        >
                                                            <X className='h-3 w-3' />
                                                        </button>
                                                    </div>
                                                ))}
                                        </>
                                    )}

                                    {/* Quick Actions */}
                                    <div className='mt-4 px-3'>
                                        <span className='text-xs font-medium text-muted-foreground'>
                                            Quick Actions
                                        </span>
                                        <div className='mt-2 grid grid-cols-2 gap-2'>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    navigate({
                                                        to: "/pipelines",
                                                    });
                                                }}
                                                className='flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted rounded-lg transition-colors'
                                            >
                                                <span>View All Pipelines</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    navigate({
                                                        to: "/incidents",
                                                    });
                                                }}
                                                className='flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted rounded-lg transition-colors'
                                            >
                                                <span>View Incidents</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className='flex items-center justify-between px-4 py-2 border-t border-border bg-muted/50 text-xs text-muted-foreground'>
                            <div className='flex items-center gap-4'>
                                <span>
                                    <kbd className='px-1.5 py-0.5 bg-background rounded border'>
                                        ↑↓
                                    </kbd>{" "}
                                    to navigate
                                </span>
                                <span>
                                    <kbd className='px-1.5 py-0.5 bg-background rounded border'>
                                        ↵
                                    </kbd>{" "}
                                    to select
                                </span>
                            </div>
                            <span>
                                <kbd className='px-1.5 py-0.5 bg-background rounded border'>
                                    esc
                                </kbd>{" "}
                                to close
                            </span>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
