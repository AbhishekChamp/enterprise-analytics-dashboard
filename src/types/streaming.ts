// Streaming Data Metrics Types

export type StreamStatus = 'active' | 'paused' | 'failed' | 'scaling';
export type ConsumerLagStatus = 'healthy' | 'warning' | 'critical';

export interface StreamMetrics {
  id: string;
  name: string;
  type: 'kafka' | 'kinesis' | 'pubsub' | 'eventhub' | 'pulsar';
  status: StreamStatus;
  topic: string;
  partitionCount: number;
  replicationFactor: number;
  owner: string;
  team: string;
  environment: 'production' | 'staging' | 'development';
  
  // Throughput metrics
  throughput: {
    messagesInPerSec: number;
    messagesOutPerSec: number;
    bytesInPerSec: number;
    bytesOutPerSec: number;
  };
  
  // Consumer groups
  consumerGroups: ConsumerGroup[];
  
  // Partition metrics
  partitions: PartitionMetrics[];
  
  // Health
  health: {
    underReplicatedPartitions: number;
    offlinePartitions: number;
    inSyncReplicas: number;
    totalReplicas: number;
  };
}

export interface ConsumerGroup {
  id: string;
  name: string;
  status: 'stable' | 'rebalancing' | 'empty' | 'dead';
  consumers: number;
  lag: number;
  lagStatus: ConsumerLagStatus;
  throughput: number;
  averageProcessingTime: number;
  lastCommit: string;
}

export interface PartitionMetrics {
  partition: number;
  leader: number;
  replicas: number[];
  inSyncReplicas: number[];
  earliestOffset: number;
  latestOffset: number;
  logSizeBytes: number;
}

export interface StreamingSummary {
  totalTopics: number;
  totalPartitions: number;
  totalConsumerGroups: number;
  averageLag: number;
  criticalLags: number;
  totalThroughputMBps: number;
}
