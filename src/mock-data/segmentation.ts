import type { 
  SegmentMetrics, 
  RegionalData, 
  PlanDistribution, 
  RetentionData 
} from '@/types/segmentation';

export const segmentMetrics: SegmentMetrics[] = [
  {
    segment: 'Enterprise',
    userCount: 1250,
    revenue: 450000,
    growthRate: 12.5,
    retentionRate: 94.2,
    churnRate: 1.8,
    avgRevenuePerUser: 360
  },
  {
    segment: 'Mid-Market',
    userCount: 8500,
    revenue: 680000,
    growthRate: 18.3,
    retentionRate: 88.5,
    churnRate: 4.2,
    avgRevenuePerUser: 80
  },
  {
    segment: 'SMB',
    userCount: 45000,
    revenue: 900000,
    growthRate: 24.1,
    retentionRate: 82.3,
    churnRate: 6.8,
    avgRevenuePerUser: 20
  },
  {
    segment: 'Self-Serve',
    userCount: 125000,
    revenue: 625000,
    growthRate: 15.7,
    retentionRate: 76.8,
    churnRate: 8.5,
    avgRevenuePerUser: 5
  }
];

export const regionalData: RegionalData[] = [
  {
    region: 'North America',
    userCount: 87500,
    revenue: 1450000,
    growthRate: 14.2
  },
  {
    region: 'Europe',
    userCount: 54200,
    revenue: 720000,
    growthRate: 18.6
  },
  {
    region: 'Asia Pacific',
    userCount: 42500,
    revenue: 580000,
    growthRate: 28.3
  },
  {
    region: 'Latin America',
    userCount: 18500,
    revenue: 195000,
    growthRate: 22.1
  },
  {
    region: 'Middle East & Africa',
    userCount: 12050,
    revenue: 85000,
    growthRate: 31.5
  }
];

export const planDistribution: PlanDistribution[] = [
  {
    plan: 'Free',
    userCount: 180000,
    percentage: 82.1,
    revenue: 0
  },
  {
    plan: 'Pro',
    userCount: 32000,
    percentage: 14.6,
    revenue: 640000
  },
  {
    plan: 'Enterprise',
    userCount: 7250,
    percentage: 3.3,
    revenue: 2175000
  }
];

export const retentionData: RetentionData[] = [
  { cohort: '2024-01', month0: 100, month1: 85, month2: 78, month3: 72, month6: 65, month12: 58 },
  { cohort: '2024-02', month0: 100, month1: 87, month2: 80, month3: 75, month6: 68, month12: 0 },
  { cohort: '2024-03', month0: 100, month1: 86, month2: 79, month3: 74, month6: 0, month12: 0 },
  { cohort: '2024-04', month0: 100, month1: 88, month2: 82, month3: 77, month6: 0, month12: 0 },
  { cohort: '2024-05', month0: 100, month1: 89, month2: 83, month3: 0, month6: 0, month12: 0 },
  { cohort: '2024-06', month0: 100, month1: 90, month2: 0, month3: 0, month6: 0, month12: 0 }
];
