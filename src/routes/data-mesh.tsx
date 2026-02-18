import { createFileRoute } from '@tanstack/react-router';
import { DataMeshView } from '@/features/data-mesh/data-mesh';

export const Route = createFileRoute('/data-mesh')({
  component: DataMeshView,
});
