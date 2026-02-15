import { 
  Activity,
  ArrowLeft,
  Clock,
  Code,
  Database,
  GitBranch,
  Layers,
  Shield,
  Users,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            About Enterprise Analytics
          </h1>
          <p className="mt-2 text-muted-foreground">
            Comprehensive data platform for monitoring ETL pipelines, API performance, and business metrics
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-foreground">
            <Layers className="h-7 w-7 text-blue-600" />
            Project Overview
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Enterprise Analytics Dashboard is a production-grade frontend application designed to simulate 
            real-world data engineering and business intelligence platforms. It provides comprehensive 
            monitoring capabilities for ETL pipelines, API observability, data freshness tracking, and 
            user segmentation analytics.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Built entirely on the client side with realistic mock data and real-time simulation, 
            this dashboard demonstrates modern frontend engineering practices including state management, 
            data visualization, role-based access control, and responsive UI design.
          </p>
        </section>

        {/* Core Modules */}
        <section className="mb-12">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
            <Database className="h-7 w-7 text-green-600" />
            Core Modules
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <GitBranch className="h-5 w-5 text-blue-600" />
                Data Pipeline Monitoring
              </h3>
              <p className="text-sm text-muted-foreground">
                Monitor ETL job execution with real-time status updates, step-level breakdowns, 
                execution logs, and retry capabilities. Track records processed and duration metrics.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Activity className="h-5 w-5 text-purple-600" />
                API Observability
              </h3>
              <p className="text-sm text-muted-foreground">
                Track API latency percentiles (P50, P95, P99), error rates, throughput, and availability. 
                Regional breakdown and endpoint-level performance metrics.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Clock className="h-5 w-5 text-yellow-600" />
                Data Freshness & SLA
              </h3>
              <p className="text-sm text-muted-foreground">
                Monitor dataset refresh schedules, track SLA compliance, and identify delayed or stale 
                data. Visual freshness indicators with breach notifications.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Users className="h-5 w-5 text-pink-600" />
                User Segmentation
              </h3>
              <p className="text-sm text-muted-foreground">
                Analyze user segments by plan, region, and behavior. Track retention rates, churn, 
                revenue contribution, and cohort analysis with interactive visualizations.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Incident Tracking
              </h3>
              <p className="text-sm text-muted-foreground">
                Monitor production incidents, track error rates by service, view MTTR metrics, 
                and manage incident resolution workflows with severity-based prioritization.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Shield className="h-5 w-5 text-green-600" />
                Role-Based Access
              </h3>
              <p className="text-sm text-muted-foreground">
                Admin and Viewer roles with conditional UI rendering. Admins can retry pipelines, 
                view logs, and resolve incidents. Viewers have read-only access to dashboards.
              </p>
            </div>
          </div>
        </section>

        {/* Real-Time Simulation */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-foreground">
            <RefreshCw className="h-7 w-7 text-cyan-600" />
            Real-Time Simulation
          </h2>
          
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-4 text-muted-foreground">
              The dashboard includes a sophisticated simulation engine that continuously updates data 
              to mimic a live production environment:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-blue-600">•</span>
                <span><strong>Pipeline Status Changes:</strong> Jobs transition between PENDING, RUNNING, SUCCESS, and FAILED states</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600">•</span>
                <span><strong>API Metrics Updates:</strong> Latency, error rates, and throughput fluctuate in real-time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600">•</span>
                <span><strong>Dataset Freshness:</strong> SLA compliance changes as refresh times vary</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600">•</span>
                <span><strong>Incident Management:</strong> Active incidents can be resolved or escalated</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600">•</span>
                <span><strong>Error Logging:</strong> New errors appear dynamically with type classification</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-foreground">
            <Code className="h-7 w-7 text-blue-600" />
            Tech Stack
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {[
              'React 19',
              'TypeScript 5.7',
              'Vite 7',
              'Tailwind CSS v4',
              'TanStack Router',
              'TanStack Query',
              'Recharts',
              'Zustand',
              'Lucide Icons',
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
