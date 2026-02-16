import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/app-store';
import type { PipelineStatus } from '@/types/pipeline';
import type { FreshnessStatus } from '@/types/freshness';
import type { ErrorType, IncidentStatus, Incident } from '@/types/incidents';
import type { Region } from '@/types/api-monitoring';

const errorTypes: ErrorType[] = ['runtime', 'timeout', 'database', 'network', 'auth', 'validation'];
const regions: Region[] = ['us-east', 'us-west', 'eu-west', 'eu-central', 'ap-south', 'ap-northeast'];

// Constants for simulation intervals (in ms)
const SIMULATION_INTERVALS = {
  PIPELINE: 30000,      // Increased from 8000 - 30 seconds
  FRESHNESS: 45000,     // Increased from 12000 - 45 seconds
  INCIDENT: 60000,      // Increased from 20000 - 60 seconds
  ERROR: 30000,         // Increased from 15000 - 30 seconds
  API_METRICS: 20000    // Increased from 10000 - 20 seconds
};

export const useSimulation = () => {
  const { 
    isSimulationActive, 
    updatePipelineStatus, 
    retryPipeline,
    updateDatasetFreshness,
    updateIncidentStatus,
    addErrorLog,
    addApiMetric
  } = useAppStore();
  
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const isRunningRef = useRef(false);

  // Stable callbacks using refs to avoid re-subscription
  const callbacksRef = useRef({
    updatePipelineStatus,
    retryPipeline,
    updateDatasetFreshness,
    updateIncidentStatus,
    addErrorLog,
    addApiMetric
  });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = {
      updatePipelineStatus,
      retryPipeline,
      updateDatasetFreshness,
      updateIncidentStatus,
      addErrorLog,
      addApiMetric
    };
  }, [updatePipelineStatus, retryPipeline, updateDatasetFreshness, updateIncidentStatus, addErrorLog, addApiMetric]);

  useEffect(() => {
    // Clear existing intervals if simulation is disabled or already running
    if (!isSimulationActive || isRunningRef.current) {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
      isRunningRef.current = false;
      return;
    }

    isRunningRef.current = true;

    // Pipeline simulation - batch updates
    const pipelineInterval = setInterval(() => {
      const state = useAppStore.getState();
      const pipelines = state.pipelines;
      if (pipelines.length === 0) return;
      
      const randomPipeline = pipelines[Math.floor(Math.random() * pipelines.length)];
      if (!randomPipeline) return;
      
      const rand = Math.random();
      let newStatus: PipelineStatus = randomPipeline.status;
      
      if (randomPipeline.status === 'RUNNING') {
        newStatus = rand > 0.2 ? 'SUCCESS' : 'FAILED';
      } else if (randomPipeline.status === 'SUCCESS') {
        newStatus = rand > 0.9 ? 'RUNNING' : 'SUCCESS';
      } else if (randomPipeline.status === 'FAILED') {
        newStatus = rand > 0.7 ? 'RUNNING' : 'FAILED';
      }
      
      if (newStatus !== randomPipeline.status) {
        callbacksRef.current.updatePipelineStatus(randomPipeline.id, newStatus);
        
        if (newStatus === 'RUNNING' && randomPipeline.status === 'FAILED') {
          callbacksRef.current.retryPipeline(randomPipeline.id);
        }
      }
    }, SIMULATION_INTERVALS.PIPELINE);

    // Dataset freshness simulation
    const freshnessInterval = setInterval(() => {
      const state = useAppStore.getState();
      const datasets = state.datasets;
      if (datasets.length === 0) return;
      
      const randomDataset = datasets[Math.floor(Math.random() * datasets.length)];
      if (!randomDataset) return;
      
      const rand = Math.random();
      let newStatus: FreshnessStatus = randomDataset.freshnessStatus;
      let delayMinutes = randomDataset.delayMinutes;
      
      if (rand < 0.7) {
        newStatus = 'FRESH';
        delayMinutes = Math.floor(Math.random() * 10);
      } else if (rand < 0.9) {
        newStatus = 'DELAYED';
        delayMinutes = 30 + Math.floor(Math.random() * 30);
      } else {
        newStatus = 'STALE';
        delayMinutes = 120 + Math.floor(Math.random() * 60);
      }
      
      callbacksRef.current.updateDatasetFreshness(randomDataset.id, newStatus, delayMinutes);
    }, SIMULATION_INTERVALS.FRESHNESS);

    // Incident simulation
    const incidentInterval = setInterval(() => {
      const state = useAppStore.getState();
      const incidents = state.incidents;
      const activeIncidentsList = incidents.filter((i: Incident) => i.status === 'open' || i.status === 'investigating');
      
      if (activeIncidentsList.length > 0 && Math.random() > 0.7) {
        const randomIncident = activeIncidentsList[Math.floor(Math.random() * activeIncidentsList.length)];
        const newStatus: IncidentStatus = Math.random() > 0.3 ? 'resolved' : 'investigating';
        callbacksRef.current.updateIncidentStatus(randomIncident.id, newStatus);
      }
    }, SIMULATION_INTERVALS.INCIDENT);

    // Error log simulation - reduce frequency
    const errorInterval = setInterval(() => {
      if (Math.random() > 0.85) {  // Increased threshold from 0.8 to 0.85
        const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        const services = ['payment-service', 'user-service', 'inventory-service', 'auth-service'];
        
        callbacksRef.current.addErrorLog({
          id: `err-${Date.now()}`,
          timestamp: new Date().toISOString(),
          errorType,
          message: `Simulated ${errorType} error`,
          service: services[Math.floor(Math.random() * services.length)],
          resolved: false
        });
      }
    }, SIMULATION_INTERVALS.ERROR);

    // API metrics simulation - limit array size
    const apiInterval = setInterval(() => {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const baseLatency = 50 + Math.random() * 40;
      
      callbacksRef.current.addApiMetric({
        timestamp: new Date().toISOString(),
        latencyP50: Math.floor(baseLatency),
        latencyP95: Math.floor(baseLatency * 1.8),
        latencyP99: Math.floor(baseLatency * 2.5),
        errorRate: parseFloat((Math.random() * 1.5).toFixed(2)),
        throughput: Math.floor(800 + Math.random() * 400),
        successCount: Math.floor(950 + Math.random() * 200),
        errorCount: Math.floor(Math.random() * 15),
        region,
        environment: 'production'
      });
    }, SIMULATION_INTERVALS.API_METRICS);

    intervalsRef.current = [
      pipelineInterval,
      freshnessInterval,
      incidentInterval,
      errorInterval,
      apiInterval
    ];

    return () => {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
      isRunningRef.current = false;
    };
  }, [isSimulationActive]);

  return { isSimulationActive };
};
