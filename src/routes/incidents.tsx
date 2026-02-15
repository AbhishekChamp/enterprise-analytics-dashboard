import { createFileRoute } from '@tanstack/react-router';
import { IncidentTracking } from '@/features/incidents/incident-tracking';

export const Route = createFileRoute('/incidents')({
  component: IncidentTracking,
});
