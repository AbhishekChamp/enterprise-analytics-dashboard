import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { formatDate } from '@/utils/formatting';
import { LineChartComponent, ChartExportWrapper } from '@/components/charts';
import { 
  FileJson, 
  FileCode, 
  FileType,
  GitCommit,
  CheckCircle,
  ArrowRight,
  Users,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';
import type { SchemaVersion, SchemaChange } from '@/types/schema-registry';

const formatIcons = {
  avro: FileJson,
  protobuf: FileCode,
  'json-schema': FileType,
  parquet: FileType,
};

const compatibilityColors = {
  backward: 'bg-green-500',
  forward: 'bg-blue-500',
  full: 'bg-purple-500',
  none: 'bg-gray-500',
};

const changeTypeIcons = {
  added: Plus,
  removed: Minus,
  modified: RefreshCw,
  renamed: ArrowRight,
};

export const SchemaRegistryView = () => {
  const { schemaRegistries, schemaEvolution } = useAppStore();
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  const selectedSchemaData = useMemo(() => 
    selectedSchema ? schemaRegistries.find(s => s.id === selectedSchema) : null,
  [selectedSchema, schemaRegistries]);

  const evolutionData = useMemo(() => {
    if (!selectedSchema) return [];
    const evolution = schemaEvolution.find(e => e.schemaId === selectedSchema);
    if (!evolution) return [];
    return evolution.timeline.map(t => ({
      timestamp: t.date,
      changes: t.changes,
      breakingChanges: t.breakingChanges,
    }));
  }, [selectedSchema, schemaEvolution]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schema Registry</h1>
        <p className="text-muted-foreground">
          Manage data schemas, track evolution, and ensure compatibility
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Schemas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{schemaRegistries.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Versions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <GitCommit className="h-5 w-5 text-blue-500" />
              <span className="text-3xl font-bold">
                {schemaRegistries.reduce((acc, s) => acc + s.versions.filter(v => v.isActive).length, 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Producers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-bold">
                {schemaRegistries.reduce((acc, s) => acc + s.usage.producers, 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Consumers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span className="text-3xl font-bold">
                {schemaRegistries.reduce((acc, s) => acc + s.usage.consumers, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schema List */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Schemas</CardTitle>
            <CardDescription>Click to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schemaRegistries.map(schema => {
                const Icon = formatIcons[schema.format];
                return (
                  <div
                    key={schema.id}
                    onClick={() => {
                      setSelectedSchema(schema.id);
                      setSelectedVersion(schema.currentVersion);
                    }}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedSchema === schema.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{schema.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        v{schema.currentVersion}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{schema.subject}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {schema.compatibility}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {schema.usage.producers}p / {schema.usage.consumers}c
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Schema Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            {selectedSchemaData ? (
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedSchemaData.name}</CardTitle>
                  <CardDescription>{selectedSchemaData.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedSchemaData.format}</Badge>
                  <Badge className={`${compatibilityColors[selectedSchemaData.compatibility]} text-white`}>
                    {selectedSchemaData.compatibility}
                  </Badge>
                </div>
              </div>
            ) : (
              <>
                <CardTitle>Schema Details</CardTitle>
                <CardDescription>Select a schema to view details</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {selectedSchemaData ? (
              <div className="space-y-6">
                {/* Version Selector */}
                <div>
                  <p className="text-sm font-medium mb-2">Version History</p>
                  <div className="flex gap-2">
                    {selectedSchemaData.versions.map(version => (
                      <Button
                        key={version.id}
                        variant={selectedVersion === version.version ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedVersion(version.version)}
                      >
                        v{version.version}
                        {version.isActive && (
                          <CheckCircle className="h-3 w-3 ml-1" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Selected Version Details */}
                {selectedVersion && (
                  <VersionDetails 
                    version={selectedSchemaData.versions.find(v => v.version === selectedVersion)!}
                  />
                )}

                {/* Evolution Chart */}
                {evolutionData.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Evolution Timeline</p>
                    <ChartExportWrapper filename="schema-evolution">
                      <LineChartComponent 
                        data={evolutionData.map(d => ({
                          timestamp: d.timestamp,
                          value: d.changes,
                        }))}
                      />
                    </ChartExportWrapper>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileJson className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a schema from the list to view its details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Version Details Component
const VersionDetails = ({ version }: { version: SchemaVersion }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Created:</span>
          <span className="ml-2">{formatDate(version.createdAt)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">By:</span>
          <span className="ml-2">{version.createdBy}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Compatibility:</span>
          <span className="ml-2 capitalize">{version.compatibility}</span>
        </div>
      </div>

      {/* Schema Fields */}
      <div>
        <p className="text-sm font-medium mb-2">Schema Fields</p>
        <div className="space-y-2">
          {version.schema.map((field, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${field.mode === 'required' ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="font-medium text-sm">{field.name}</span>
                <Badge variant="outline" className="text-xs">{field.type}</Badge>
                {field.mode === 'required' && (
                  <Badge variant="secondary" className="text-xs">required</Badge>
                )}
              </div>
              {field.description && (
                <span className="text-xs text-muted-foreground">{field.description}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change Log */}
      {version.changeLog.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Changes in this Version</p>
          <div className="space-y-2">
            {version.changeLog.map((change, idx) => (
              <ChangeLogItem key={idx} change={change} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Change Log Item Component
const ChangeLogItem = ({ change }: { change: SchemaChange }) => {
  const Icon = changeTypeIcons[change.changeType];
  
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg border">
      <div className={`mt-0.5 ${change.isBreaking ? 'text-red-500' : 'text-green-500'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{change.fieldName}</span>
          <Badge variant="outline" className="text-xs capitalize">{change.changeType}</Badge>
          {change.isBreaking && (
            <Badge variant="destructive" className="text-xs">Breaking</Badge>
          )}
        </div>
        {change.description && (
          <p className="text-xs text-muted-foreground mt-1">{change.description}</p>
        )}
        {change.previousType && change.newType && (
          <p className="text-xs text-muted-foreground mt-1">
            {change.previousType} → {change.newType}
          </p>
        )}
      </div>
    </div>
  );
};
