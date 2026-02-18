// Schema Registry Types

export type SchemaChangeType = 'added' | 'removed' | 'modified' | 'renamed';
export type CompatibilityLevel = 'backward' | 'forward' | 'full' | 'none';

export interface SchemaField {
  name: string;
  type: string;
  mode: 'required' | 'nullable' | 'repeated';
  description?: string;
  defaultValue?: unknown;
  tags?: string[];
  constraints?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}

export interface SchemaVersion {
  id: string;
  version: number;
  schema: SchemaField[];
  createdAt: string;
  createdBy: string;
  changeLog: SchemaChange[];
  isActive: boolean;
  compatibility: CompatibilityLevel;
}

export interface SchemaChange {
  fieldName: string;
  changeType: SchemaChangeType;
  previousType?: string;
  newType?: string;
  previousMode?: string;
  newMode?: string;
  description?: string;
  isBreaking: boolean;
}

export interface SchemaRegistry {
  id: string;
  name: string;
  subject: string;
  description: string;
  owner: string;
  team: string;
  format: 'avro' | 'protobuf' | 'json-schema' | 'parquet';
  versions: SchemaVersion[];
  currentVersion: number;
  compatibility: CompatibilityLevel;
  tags: string[];
  usage: {
    producers: number;
    consumers: number;
  };
}

export interface SchemaEvolution {
  schemaId: string;
  timeline: {
    date: string;
    version: number;
    changes: number;
    breakingChanges: number;
  }[];
}
