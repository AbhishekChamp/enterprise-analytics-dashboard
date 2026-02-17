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
  RefreshCw,
  Keyboard,
  Download,
  Star,
  TrendingUp,
  Monitor,
  Moon
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';

export function AboutPage() {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-200px)] bg-background py-8">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
              to="/landing"
              className="mb-4 inline-flex items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
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
                  Regional breakdown and endpoint-level performance metrics with interactive charts.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Data Freshness & SLA
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monitor dataset refresh schedules, track SLA compliance, and identify delayed or stale 
                  data. Visual freshness indicators with breach notifications and export capabilities.
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
                  and manage incident resolution workflows with severity-based prioritization and bulk actions.
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

          {/* New Features */}
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Star className="h-7 w-7 text-yellow-500" />
              New Features
            </h2>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Keyboard className="h-5 w-5 text-indigo-600" />
                  Keyboard Shortcuts
                </h3>
                <p className="text-sm text-muted-foreground">
                  Navigate quickly with keyboard shortcuts. Press ? for help, use g+d to go to dashboard, 
                  g+p for pipelines, / to focus search, and more.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Download className="h-5 w-5 text-cyan-600" />
                  CSV Export
                </h3>
                <p className="text-sm text-muted-foreground">
                  Export any table data to CSV format. Available for pipelines, incidents, datasets, 
                  and error logs with automatic file naming.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Health Score
                </h3>
                <p className="text-sm text-muted-foreground">
                  Overall system health monitoring with individual scores for pipelines, datasets, 
                  incidents, and API health. Visual progress bars show real-time status.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Monitor className="h-5 w-5 text-teal-600" />
                  Recent Activity Feed
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real-time activity tracking showing pipeline retries, incident resolutions, 
                  SLA breaches, and system events with timestamps and severity indicators.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Moon className="h-5 w-5 text-slate-600" />
                  Auto Dark Mode
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automatic theme switching based on time of day (8 PM - 6 AM). Manual override 
                  available in settings with persistent preferences.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Bulk Actions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select multiple items and perform bulk operations. Retry multiple failed pipelines 
                  or resolve multiple incidents simultaneously for improved efficiency.
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
    </PublicLayout>
  );
}
