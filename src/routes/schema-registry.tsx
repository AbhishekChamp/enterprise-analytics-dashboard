import { createFileRoute } from '@tanstack/react-router';
import { SchemaRegistryView } from '@/features/schema-registry/schema-registry';

export const Route = createFileRoute('/schema-registry')({
  component: SchemaRegistryView,
});
