import { createFileRoute } from '@tanstack/react-router';
import { SegmentationAnalytics } from '@/features/segmentation/segmentation-analytics';

export const Route = createFileRoute('/segmentation')({
  component: SegmentationAnalytics,
});
