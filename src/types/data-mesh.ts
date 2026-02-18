// Data Mesh Types

export type DomainStatus = 'active' | 'deprecated' | 'experimental';

export interface DataDomain {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerTeam: string;
  status: DomainStatus;
  color: string;
  datasets: number;
  pipelines: number;
  consumers: number;
  
  // Data products
  dataProducts: DataProduct[];
  
  // Governance
  governance: {
    dataQualityScore: number;
    documentationCoverage: number;
    lastAuditDate: string;
    complianceStatus: 'compliant' | 'non-compliant' | 'pending';
  };
  
  // Metrics
  metrics: {
    totalStorageGB: number;
    monthlyQueryVolume: number;
    uptimePercentage: number;
    dataFreshness: number; // minutes
  };
}

export interface DataProduct {
  id: string;
  name: string;
  description: string;
  type: 'dataset' | 'api' | 'dashboard' | 'ml-model';
  owner: string;
  status: DomainStatus;
  version: string;
  sla: {
    availability: number;
    freshness: string;
    support: string;
  };
  consumers: DataProductConsumer[];
  tags: string[];
}

export interface DataProductConsumer {
  id: string;
  name: string;
  team: string;
  type: 'internal' | 'external';
  usage: {
    queriesPerDay: number;
    dataVolumeGB: number;
  };
}

export interface DataMeshGovernance {
  domains: number;
  dataProducts: number;
  totalDatasets: number;
  federatedGovernance: boolean;
  standards: {
    documentation: number; // percentage
    dataQuality: number;
    metadata: number;
    accessControl: number;
  };
}

export interface DomainRelationship {
  source: string;
  target: string;
  relationship: 'depends-on' | 'produces-for' | 'shares-with';
  dataVolumeGB: number;
}
