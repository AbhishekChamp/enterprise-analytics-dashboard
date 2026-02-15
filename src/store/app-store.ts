import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Role, User } from '@/types/auth';
import type { Pipeline, PipelineStatus } from '@/types/pipeline';
import type { ApiMetrics, ApiEndpoint } from '@/types/api-monitoring';
import type { DatasetFreshness, FreshnessStatus } from '@/types/freshness';
import type { Incident, IncidentStatus, ErrorLog } from '@/types/incidents';
import {
  initialPipelines,
  initialApiMetrics,
  initialApiEndpoints,
  initialDatasets,
  activeIncidents,
  recentIncidents,
  errorLogs,
  serviceHealth
} from '@/mock-data';

interface AppState {
  // Auth
  currentUser: User;
  setRole: (role: Role) => void;
  
  // Pipelines
  pipelines: Pipeline[];
  updatePipelineStatus: (id: string, status: PipelineStatus) => void;
  retryPipeline: (id: string) => void;
  
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
  addErrorLog: (error: ErrorLog) => void;
  
  // Simulation
  isSimulationActive: boolean;
  toggleSimulation: () => void;
}

const initialUser: User = {
  id: 'user-001',
  name: 'Admin User',
  email: 'admin@company.com',
  role: 'ADMIN'
};

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Auth
      currentUser: initialUser,
      setRole: (role) => set((state) => ({
        currentUser: { ...state.currentUser, role }
      })),
      
      // Pipelines
      pipelines: initialPipelines,
      updatePipelineStatus: (id, status) => set((state) => ({
        pipelines: state.pipelines.map(p => 
          p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
        )
      })),
      retryPipeline: (id) => set((state) => ({
        pipelines: state.pipelines.map(p => 
          p.id === id 
            ? { 
                ...p, 
                status: 'RUNNING' as PipelineStatus, 
                retryCount: p.retryCount + 1,
                updatedAt: new Date().toISOString()
              } 
            : p
        )
      })),
      
      // API Monitoring
      apiMetrics: initialApiMetrics,
      apiEndpoints: initialApiEndpoints,
      addApiMetric: (metric) => set((state) => ({
        apiMetrics: [...state.apiMetrics.slice(1), metric]
      })),
      
      // Freshness
      datasets: initialDatasets,
      updateDatasetFreshness: (id, status, delayMinutes) => set((state) => ({
        datasets: state.datasets.map(d => 
          d.id === id 
            ? { 
                ...d, 
                freshnessStatus: status, 
                delayMinutes,
                slaBreach: delayMinutes > 60,
                actualRefreshTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                lastUpdated: new Date().toISOString()
              } 
            : d
        )
      })),
      
      // Incidents
      incidents: [...activeIncidents, ...recentIncidents],
      errorLogs: errorLogs,
      serviceHealth: serviceHealth,
      updateIncidentStatus: (id, status) => set((state) => ({
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
        )
      })),
      addErrorLog: (error) => set((state) => ({
        errorLogs: [error, ...state.errorLogs.slice(0, 99)]
      })),
      
      // Simulation
      isSimulationActive: true,
      toggleSimulation: () => set((state) => ({ 
        isSimulationActive: !state.isSimulationActive 
      }))
    }),
    { name: 'app-store' }
  )
);
