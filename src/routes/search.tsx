import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useAppStore } from '@/store/app-store';

// Define search params type
interface SearchParams {
  q: string;
}

export const Route = createFileRoute('/search')({
  component: SearchResultsPage,
});

interface SearchResult {
  id: string;
  type: 'pipeline' | 'incident' | 'dataset';
  title: string;
  description: string;
  status?: string;
  severity?: string;
  href: string;
}

function SearchResultsPage() {
  const search = useSearch({ from: '/search' }) as SearchParams;
  const q = search.q || '';
  const { pipelines, incidents, datasets } = useAppStore();

  // Search across all data
  const results = useMemo<SearchResult[]>(() => {
    if (!q) return [];
    
    const query = q.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search pipelines
    pipelines.forEach((pipeline) => {
      if (
        pipeline.name.toLowerCase().includes(query) ||
        pipeline.description?.toLowerCase().includes(query)
      ) {
        allResults.push({
          id: pipeline.id,
          type: 'pipeline',
          title: pipeline.name,
          description: pipeline.description || 'No description',
          status: pipeline.status,
          href: `/pipelines/${pipeline.id}`,
        });
      }
    });

    // Search incidents
    incidents.forEach((incident) => {
      if (
        incident.title.toLowerCase().includes(query) ||
        incident.description.toLowerCase().includes(query)
      ) {
        allResults.push({
          id: incident.id,
          type: 'incident',
          title: incident.title,
          description: incident.description,
          status: incident.status,
          severity: incident.severity,
          href: '/incidents',
        });
      }
    });

    // Search datasets
    datasets.forEach((dataset) => {
      if (dataset.datasetName.toLowerCase().includes(query)) {
        allResults.push({
          id: dataset.id,
          type: 'dataset',
          title: dataset.datasetName,
          description: `Last updated: ${dataset.lastUpdated}`,
          status: dataset.freshnessStatus,
          href: '/freshness',
        });
      }
    });

    return allResults;
  }, [q, pipelines, incidents, datasets]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {
      pipeline: [],
      incident: [],
      dataset: [],
    };
    
    results.forEach((result) => {
      groups[result.type].push(result);
    });
    
    return groups;
  }, [results]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'fresh':
        return 'bg-green-500';
      case 'running':
      case 'in_progress':
        return 'bg-blue-500';
      case 'failed':
      case 'error':
      case 'critical':
      case 'stale':
        return 'bg-red-500';
      case 'warning':
      case 'delayed':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pipeline':
        return '🔧';
      case 'incident':
        return '⚠️';
      case 'dataset':
        return '📊';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Search Results</h1>
          <p className="text-muted-foreground">
            {results.length} results for "{q}"
          </p>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <EmptyState
          icon="search"
          title="No results found"
          description={`We couldn't find anything matching "${q}". Try different keywords or check your spelling.`}
          action={{
            label: 'Clear Search',
            onClick: () => window.history.back(),
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* Summary */}
          <div className="flex flex-wrap gap-4">
            {Object.entries(groupedResults).map(([type, items]) => 
              items.length > 0 ? (
                <div
                  key={type}
                  className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg"
                >
                  <span>{getTypeIcon(type)}</span>
                  <span className="capitalize font-medium">{type}s</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-sm">
                    {items.length}
                  </span>
                </div>
              ) : null
            )}
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {results.map((result) => (
              <a
                key={`${result.type}-${result.id}`}
                href={result.href}
                className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all group"
              >
                {/* Icon */}
                <div className="p-3 bg-muted rounded-lg text-2xl">
                  {getTypeIcon(result.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {result.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize">
                      {result.type}
                    </span>
                    {result.status && (
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor(result.status)}`}
                        title={result.status}
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {result.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
