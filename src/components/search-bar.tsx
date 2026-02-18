import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, X, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/utils/formatting';

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'pipeline' | 'dataset' | 'incident' | 'page' | 'query';
  href: string;
  icon?: string;
}

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { pipelines, datasets, incidents } = useAppStore();

  // Generate suggestions based on query
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!query.trim()) {
      // Show recent/popular items when no query
      return [
        { id: 'page-dashboard', title: 'Dashboard', subtitle: 'Main dashboard', type: 'page', href: '/' },
        { id: 'page-pipelines', title: 'Pipelines', subtitle: 'View all pipelines', type: 'page', href: '/pipelines' },
        { id: 'page-lineage', title: 'Data Lineage', subtitle: 'Visualize data flow', type: 'page', href: '/lineage' },
        { id: 'page-cost', title: 'Cost Analytics', subtitle: 'Monitor infrastructure costs', type: 'page', href: '/cost-analytics' },
      ];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchSuggestion[] = [];

    // Search pipelines
    pipelines
      .filter(p => 
        p.name.toLowerCase().includes(normalizedQuery) ||
        p.description.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 3)
      .forEach(p => {
        results.push({
          id: `pipeline-${p.id}`,
          title: p.name,
          subtitle: `${p.status} • ${p.description.slice(0, 40)}...`,
          type: 'pipeline',
          href: `/pipelines/${p.id}`,
        });
      });

    // Search datasets
    datasets
      .filter(d => 
        d.datasetName.toLowerCase().includes(normalizedQuery) ||
        d.description.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 3)
      .forEach(d => {
        results.push({
          id: `dataset-${d.id}`,
          title: d.datasetName,
          subtitle: `${d.freshnessStatus} • ${d.owner}`,
          type: 'dataset',
          href: '/freshness',
        });
      });

    // Search incidents
    incidents
      .filter(i => 
        i.title.toLowerCase().includes(normalizedQuery) ||
        i.service.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 3)
      .forEach(i => {
        results.push({
          id: `incident-${i.id}`,
          title: i.title,
          subtitle: `${i.severity} • ${i.service}`,
          type: 'incident',
          href: '/incidents',
        });
      });

    // Add navigation pages
    const pages = [
      { name: 'Data Lineage', href: '/lineage', desc: 'Visualize data dependencies' },
      { name: 'Cost Analytics', href: '/cost-analytics', desc: 'Infrastructure cost tracking' },
      { name: 'Query Performance', href: '/query-performance', desc: 'Query optimization' },
      { name: 'Schema Registry', href: '/schema-registry', desc: 'Schema management' },
      { name: 'Streaming', href: '/streaming', desc: 'Real-time stream metrics' },
      { name: 'Data Mesh', href: '/data-mesh', desc: 'Domain-oriented data' },
      { name: 'API Monitoring', href: '/api-monitoring', desc: 'API observability' },
      { name: 'Freshness', href: '/freshness', desc: 'Data freshness & SLA' },
      { name: 'Segmentation', href: '/segmentation', desc: 'User analytics' },
      { name: 'Incidents', href: '/incidents', desc: 'Incident tracking' },
    ];

    pages
      .filter(p => p.name.toLowerCase().includes(normalizedQuery))
      .forEach(p => {
        results.push({
          id: `page-${p.href}`,
          title: p.name,
          subtitle: p.desc,
          type: 'page',
          href: p.href,
        });
      });

    // Add "Search for query" option
    results.push({
      id: 'search-query',
      title: `Search "${query}"`,
      subtitle: 'Search across all pipelines',
      type: 'query',
      href: `/pipelines?q=${encodeURIComponent(query)}`,
    });

    return results;
  }, [query, pipelines, datasets, incidents]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle selection
  const handleSelect = (suggestion: SearchSuggestion) => {
    setQuery('');
    setIsOpen(false);
    navigate({ to: suggestion.href });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pipeline':
        return '🔀';
      case 'dataset':
        return '📊';
      case 'incident':
        return '🚨';
      case 'page':
        return '📄';
      case 'query':
        return '🔍';
      default:
        return '📄';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex]);
          }
        }}
        className="relative"
      >
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
          aria-hidden="true" 
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search pipelines, datasets, pages... (Press / to focus)"
          className="w-full pl-10 pr-10 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          aria-label="Search pipelines, datasets, and pages"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
            aria-label="Clear search"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          id="search-suggestions"
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto"
          role="listbox"
        >
          {/* Group by type */}
          {['pipeline', 'dataset', 'incident', 'page', 'query'].map((type) => {
            const typeSuggestions = suggestions.filter(s => s.type === type);
            if (typeSuggestions.length === 0) return null;

            return (
              <div key={type}>
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 uppercase tracking-wider">
                  {type === 'query' ? 'Search' : `${type}s`}
                </div>
                {typeSuggestions.map((suggestion) => {
                  const globalIndex = suggestions.indexOf(suggestion);
                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelect(suggestion)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={cn(
                        "w-full px-3 py-2 flex items-center gap-3 text-left transition-colors",
                        globalIndex === selectedIndex && "bg-accent"
                      )}
                      role="option"
                      aria-selected={globalIndex === selectedIndex}
                    >
                      <span className="text-lg" aria-hidden="true">
                        {getTypeIcon(suggestion.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {suggestion.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {suggestion.subtitle}
                        </p>
                      </div>
                      {globalIndex === selectedIndex && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Keyboard hints */}
          <div className="px-3 py-2 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <span>{suggestions.length} results</span>
          </div>
        </div>
      )}
    </div>
  );
}
