import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/app-store';
import type { PipelineStatus } from '@/types/pipeline';
import type { FreshnessStatus } from '@/types/freshness';
import type { ErrorType, IncidentStatus, Incident } from '@/types/incidents';
import type { Region } from '@/types/api-monitoring';

const errorTypes: ErrorType[] = ['runtime', 'timeout', 'database', 'network', 'auth', 'validation'];
const regions: Region[] = ['us-east', 'us-west', 'eu-west', 'eu-central', 'ap-south', 'ap-northeast'];

export const useSimulation = () => {
  const { 
    isSimulationActive, 
    pipelines,
    updatePipelineStatus, 
    retryPipeline,
    updateDatasetFreshness,
    updateIncidentStatus,
    addErrorLog,
    addApiMetric
  } = useAppStore();
  
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    if (!isSimulationActive) {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
      return;
    }

    // Pipeline simulation
    const pipelineInterval = setInterval(() => {
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
        updatePipelineStatus(randomPipeline.id, newStatus);
        
        if (newStatus === 'RUNNING' && randomPipeline.status === 'FAILED') {
          retryPipeline(randomPipeline.id);
        }
      }
    }, 8000);

    // Dataset freshness simulation
    const freshnessInterval = setInterval(() => {
      const datasets = useAppStore.getState().datasets;
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
      
      updateDatasetFreshness(randomDataset.id, newStatus, delayMinutes);
    }, 12000);

    // Incident simulation
    const incidentInterval = setInterval(() => {
      const incidents = useAppStore.getState().incidents;
      const activeIncidentsList = incidents.filter((i: Incident) => i.status === 'open' || i.status === 'investigating');
      
      if (activeIncidentsList.length > 0 && Math.random() > 0.7) {
        const randomIncident = activeIncidentsList[Math.floor(Math.random() * activeIncidentsList.length)];
        const newStatus: IncidentStatus = Math.random() > 0.3 ? 'resolved' : 'investigating';
        updateIncidentStatus(randomIncident.id, newStatus);
      }
    }, 20000);

    // Error log simulation
    const errorInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        const services = ['payment-service', 'user-service', 'inventory-service', 'auth-service'];
        
        addErrorLog({
          id: `err-${Date.now()}`,
          timestamp: new Date().toISOString(),
          errorType,
          message: `Simulated ${errorType} error`,
          service: services[Math.floor(Math.random() * services.length)],
          resolved: false
        });
      }
    }, 15000);

    // API metrics simulation
    const apiInterval = setInterval(() => {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const baseLatency = 50 + Math.random() * 40;
      
      addApiMetric({
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
    }, 10000);

    intervalsRef.current = [
      pipelineInterval,
      freshnessInterval,
      incidentInterval,
      errorInterval,
      apiInterval
    ];

    return () => {
      intervalsRef.current.forEach(clearInterval);
    };
  }, [isSimulationActive, pipelines, updatePipelineStatus, retryPipeline, updateDatasetFreshness, updateIncidentStatus, addErrorLog, addApiMetric]);

  return { isSimulationActive };
};
