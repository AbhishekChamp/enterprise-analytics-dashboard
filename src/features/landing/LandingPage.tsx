import { useNavigate } from '@tanstack/react-router';
import { Activity, BarChart3, Shield, Zap } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate login without credentials
    toast.success('Welcome to DataOps Analytics!', {
      duration: 2000,
    });
    
    // Small delay to show the toast before navigating
    setTimeout(() => {
      navigate({ to: '/' });
    }, 500);
  };

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
              <Activity className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              DataOps Analytics
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Enterprise-grade data pipeline monitoring and analytics platform.
              Track pipelines, monitor API performance, and ensure data freshness.
            </p>
          </div>

          {/* Login Button */}
          <div className="mb-16">
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="px-8 py-6 text-lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              No credentials required. Click to explore the dashboard.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-3">
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
              title="Pipeline Monitoring"
              description="Real-time tracking of ETL pipelines with success rates and performance metrics"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-green-600" />}
              title="Data Freshness"
              description="Monitor SLA compliance and ensure your data is always up to date"
            />
            <FeatureCard
              icon={<Activity className="h-6 w-6 text-purple-600" />}
              title="API Observability"
              description="Track API latency, error rates, and throughput across all regions"
            />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-3 inline-flex rounded-lg bg-accent p-3">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-card-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
