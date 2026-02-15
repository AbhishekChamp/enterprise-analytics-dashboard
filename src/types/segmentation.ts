export type UserPlan = 'Free' | 'Pro' | 'Enterprise';
export type UserSegment = 'new' | 'active' | 'churned' | 'resurrected';

export interface SegmentMetrics {
  segment: string;
  userCount: number;
  revenue: number;
  growthRate: number;
  retentionRate: number;
  churnRate: number;
  avgRevenuePerUser: number;
}

export interface RegionalData {
  region: string;
  userCount: number;
  revenue: number;
  growthRate: number;
}

export interface PlanDistribution {
  plan: UserPlan;
  userCount: number;
  percentage: number;
  revenue: number;
}

export interface RetentionData {
  cohort: string;
  month0: number;
  month1: number;
  month2: number;
  month3: number;
  month6: number;
  month12: number;
}
