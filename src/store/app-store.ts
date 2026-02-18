import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Role, User } from '@/types/auth';
import type { Pipeline, PipelineStatus } from '@/types/pipeline';
import type { ApiMetrics, ApiEndpoint } from '@/types/api-monitoring';
import type { DatasetFreshness, FreshnessStatus } from '@/types/freshness';
import type { Incident, IncidentStatus, ErrorLog } from '@/types/incidents';
import type { Activity } from '@/types/activity';
import { createActivity } from '@/types/activity';
import type { LineageGraph, ImpactAnalysis } from '@/types/lineage';
import type { CostMetric, CostBudget, CostAttribution, CostSummary } from '@/types/cost-analytics';
import type { QueryMetrics, QueryOptimization, TableStatistics, QueryPerformanceSummary } from '@/types/query-performance';
import type { SchemaRegistry, SchemaEvolution } from '@/types/schema-registry';
import type { StreamMetrics, StreamingSummary } from '@/types/streaming';
import type { DataDomain, DataMeshGovernance, DomainRelationship } from '@/types/data-mesh';
import {
  initialPipelines,
  initialApiMetrics,
  initialApiEndpoints,
  initialDatasets,
  activeIncidents,
  recentIncidents,
  errorLogs,
  serviceHealth,
  mockLineageGraph,
  mockImpactAnalysis,
  mockCostMetrics,
  mockCostBudgets,
  mockCostAttribution,
  mockCostSummary,
  mockQueryMetrics,
  mockQueryOptimizations,
  mockTableStatistics,
  mockQueryPerformanceSummary,
  mockSchemaRegistries,
  mockSchemaEvolution,
  mockStreamMetrics,
  mockStreamingSummary,
  mockDataDomains,
  mockDataMeshGovernance,
  mockDomainRelationships,
} from '@/mock-data';

// Maximum number of metrics to keep in memory
const MAX_API_METRICS = 50;
const MAX_ERROR_LOGS = 50;
const MAX_ACTIVITIES = 100;

interface AppState {
  // Auth
  currentUser: User;
  setRole: (role: Role) => void;

  // Pipelines
  pipelines: Pipeline[];
  updatePipelineStatus: (id: string, status: PipelineStatus) => void;
  retryPipeline: (id: string) => void;
  retryMultiplePipelines: (ids: string[]) => void;

  // Favorites
  favoritePipelines: string[];
  toggleFavoritePipeline: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // API Monitoring
  apiMetrics: ApiMetrics[];
  apiEndpoints: ApiEndpoint[];
  addApiMetric: (metric: ApiMetrics) => void;

  // Freshness
  datasets: DatasetFreshness[];
  updateDatasetFreshness: (id: string, status: FreshnessStatus, delayMinutes: number) => void;

  // Incidents
  incidents: Incident[];
  errorLogs: ErrorLog[];
  serviceHealth: typeof serviceHealth;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  resolveMultipleIncidents: (ids: string[]) => void;
  addErrorLog: (error: ErrorLog) => void;

  // Activity
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  clearActivities: () => void;

  // Simulation
  isSimulationActive: boolean;
  toggleSimulation: () => void;

  // Performance
  lastDataUpdate: string;

  // Data Lineage
  lineageGraph: LineageGraph;
  impactAnalysis: ImpactAnalysis[];
  getImpactAnalysis: (nodeId: string) => ImpactAnalysis | undefined;

  // Cost Analytics
  costMetrics: CostMetric[];
  costBudgets: CostBudget[];
  costAttribution: CostAttribution[];
  costSummary: CostSummary;

  // Query Performance
  queryMetrics: QueryMetrics[];
  queryOptimizations: QueryOptimization[];
  tableStatistics: TableStatistics[];
  queryPerformanceSummary: QueryPerformanceSummary;

  // Schema Registry
  schemaRegistries: SchemaRegistry[];
  schemaEvolution: SchemaEvolution[];
  getSchemaById: (id: string) => SchemaRegistry | undefined;

  // Streaming
  streamMetrics: StreamMetrics[];
  streamingSummary: StreamingSummary;

  // Data Mesh
  dataDomains: DataDomain[];
  dataMeshGovernance: DataMeshGovernance;
  domainRelationships: DomainRelationship[];
  getDomainById: (id: string) => DataDomain | undefined;
}

const initialUser: User = {
  id: 'user-001',
  name: 'Admin User',
  email: 'admin@company.com',
  role: 'ADMIN'
};

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Auth
      currentUser: initialUser,
      setRole: (role) => set((state) => ({
        currentUser: { ...state.currentUser, role }
      }), false, 'setRole'),

      // Pipelines
      pipelines: initialPipelines,
      updatePipelineStatus: (id, status) => set((state) => ({
        pipelines: state.pipelines.map(p =>
          p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
        ),
        lastDataUpdate: new Date().toISOString()
      }), false, 'updatePipelineStatus'),

      retryPipeline: (id) => {
        const state = get();
        const pipeline = state.pipelines.find(p => p.id === id);

        set((state) => ({
          pipelines: state.pipelines.map(p =>
            p.id === id
              ? {
                  ...p,
                  status: 'RUNNING' as PipelineStatus,
                  retryCount: p.retryCount + 1,
                  updatedAt: new Date().toISOString()
                }
              : p
          ),
          lastDataUpdate: new Date().toISOString()
        }), false, 'retryPipeline');

        // Add activity
        if (pipeline) {
          get().addActivity(createActivity(
            'pipeline_retry',
            'Pipeline Retry Initiated',
            `Pipeline "${pipeline.name}" has been manually retried`,
            'info',
            { pipelineId: id, pipelineName: pipeline.name }
          ));
        }
      },

      retryMultiplePipelines: (ids) => {
        const state = get();
        const pipelines = state.pipelines.filter(p => ids.includes(p.id) && p.status === 'FAILED');

        set((state) => ({
          pipelines: state.pipelines.map(p =>
            ids.includes(p.id) && p.status === 'FAILED'
              ? {
                  ...p,
                  status: 'RUNNING' as PipelineStatus,
                  retryCount: p.retryCount + 1,
                  updatedAt: new Date().toISOString()
                }
              : p
          ),
          lastDataUpdate: new Date().toISOString()
        }), false, 'retryMultiplePipelines');

        // Add activity
        if (pipelines.length > 0) {
          get().addActivity(createActivity(
            'pipeline_retry',
            'Multiple Pipelines Retried',
            `${pipelines.length} failed pipeline(s) have been retried`,
            'info',
            { pipelineIds: ids, count: pipelines.length }
          ));
        }
      },

      // Favorites
      favoritePipelines: [],
      toggleFavoritePipeline: (id) => set((state) => {
        const isFav = state.favoritePipelines.includes(id);
        return {
          favoritePipelines: isFav
            ? state.favoritePipelines.filter(fid => fid !== id)
            : [...state.favoritePipelines, id]
        };
      }, false, 'toggleFavoritePipeline'),
      isFavorite: (id) => get().favoritePipelines.includes(id),

      // API Monitoring - limit array size to prevent memory bloat
      apiMetrics: initialApiMetrics.slice(-MAX_API_METRICS),
      apiEndpoints: initialApiEndpoints,
      addApiMetric: (metric) => set((state) => ({
        apiMetrics: [...state.apiMetrics.slice(-MAX_API_METRICS + 1), metric],
        lastDataUpdate: new Date().toISOString()
      }), false, 'addApiMetric'),

      // Freshness
      datasets: initialDatasets,
      updateDatasetFreshness: (id, status, delayMinutes) => {
        const state = get();
        const dataset = state.datasets.find(d => d.id === id);
        const wasBreached = dataset?.slaBreach;
        const isBreached = delayMinutes > 60;

        set((state) => ({
          datasets: state.datasets.map(d =>
            d.id === id
              ? {
                  ...d,
                  freshnessStatus: status,
                  delayMinutes,
                  slaBreach: isBreached,
                  actualRefreshTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                  lastUpdated: new Date().toISOString()
                }
              : d
          ),
          lastDataUpdate: new Date().toISOString()
        }), false, 'updateDatasetFreshness');

        // Add activity on SLA breach
        if (!wasBreached && isBreached && dataset) {
          get().addActivity(createActivity(
            'alert_triggered',
            'SLA Breach Detected',
            `Dataset "${dataset.datasetName}" has breached SLA (${delayMinutes}m delay)`,
            'error',
            { datasetId: id, datasetName: dataset.datasetName, delayMinutes }
          ));
        }
      },

      // Incidents
      incidents: [...activeIncidents, ...recentIncidents],
      errorLogs: errorLogs.slice(0, MAX_ERROR_LOGS),
      serviceHealth: serviceHealth,
      updateIncidentStatus: (id, status) => {
        const state = get();
        const incident = state.incidents.find(i => i.id === id);
        const wasResolved = incident?.status === 'resolved' || incident?.status === 'closed';
        const isResolved = status === 'resolved';

        set((state) => ({
          incidents: state.incidents.map(i =>
            i.id === id
              ? {
                  ...i,
                  status,
                  resolvedAt: status === 'resolved' ? new Date().toISOString() : i.resolvedAt,
                  mttr: status === 'resolved' && i.startedAt
                    ? Math.floor((Date.now() - new Date(i.startedAt).getTime()) / 60000)
                    : i.mttr
                }
              : i
          ),
          lastDataUpdate: new Date().toISOString()
        }), false, 'updateIncidentStatus');

        // Add activity
        if (!wasResolved && isResolved && incident) {
          get().addActivity(createActivity(
            'incident_resolved',
            'Incident Resolved',
            `Incident "${incident.title}" has been resolved`,
            'success',
            { incidentId: id, incidentTitle: incident.title, service: incident.service }
          ));
        }
      },

      resolveMultipleIncidents: (ids) => {
        const state = get();
        const incidents = state.incidents.filter(i =>
          ids.includes(i.id) && (i.status === 'open' || i.status === 'investigating')
        );

        set((state) => ({
          incidents: state.incidents.map(i =>
            ids.includes(i.id) && (i.status === 'open' || i.status === 'investigating')
              ? {
                  ...i,
                  status: 'resolved' as IncidentStatus,
                  resolvedAt: new Date().toISOString(),
                  mttr: i.startedAt
                    ? Math.floor((Date.now() - new Date(i.startedAt).getTime()) / 60000)
                    : i.mttr
                }
              : i
          ),
          lastDataUpdate: new Date().toISOString()
        }), false, 'resolveMultipleIncidents');

        // Add activity
        if (incidents.length > 0) {
          get().addActivity(createActivity(
            'incident_resolved',
            'Multiple Incidents Resolved',
            `${incidents.length} incident(s) have been resolved`,
            'success',
            { incidentIds: ids, count: incidents.length }
          ));
        }
      },

      addErrorLog: (error) => set((state) => ({
        errorLogs: [error, ...state.errorLogs.slice(0, MAX_ERROR_LOGS - 1)],
        lastDataUpdate: new Date().toISOString()
      }), false, 'addErrorLog'),

      // Activity
      activities: [],
      addActivity: (activity) => set((state) => ({
        activities: [activity, ...state.activities.slice(0, MAX_ACTIVITIES - 1)]
      }), false, 'addActivity'),
      clearActivities: () => set({ activities: [] }, false, 'clearActivities'),

      // Simulation
      isSimulationActive: true,
      toggleSimulation: () => set((state) => ({
        isSimulationActive: !state.isSimulationActive
      }), false, 'toggleSimulation'),

      // Performance
      lastDataUpdate: new Date().toISOString(),

      // Data Lineage
      lineageGraph: mockLineageGraph,
      impactAnalysis: mockImpactAnalysis,
      getImpactAnalysis: (nodeId) => get().impactAnalysis.find(ia => ia.nodeId === nodeId),

      // Cost Analytics
      costMetrics: mockCostMetrics,
      costBudgets: mockCostBudgets,
      costAttribution: mockCostAttribution,
      costSummary: mockCostSummary,

      // Query Performance
      queryMetrics: mockQueryMetrics,
      queryOptimizations: mockQueryOptimizations,
      tableStatistics: mockTableStatistics,
      queryPerformanceSummary: mockQueryPerformanceSummary,

      // Schema Registry
      schemaRegistries: mockSchemaRegistries,
      schemaEvolution: mockSchemaEvolution,
      getSchemaById: (id) => get().schemaRegistries.find(s => s.id === id),

      // Streaming
      streamMetrics: mockStreamMetrics,
      streamingSummary: mockStreamingSummary,

      // Data Mesh
      dataDomains: mockDataDomains,
      dataMeshGovernance: mockDataMeshGovernance,
      domainRelationships: mockDomainRelationships,
      getDomainById: (id) => get().dataDomains.find(d => d.id === id),
    }),
    { name: 'app-store' }
  )
);
