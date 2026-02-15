# Enterprise Analytics Dashboard

A production-grade frontend-only enterprise analytics dashboard that simulates a real-world data engineering and business intelligence platform. Monitor ETL pipelines, API performance, data freshness, user segmentation, and incidents with real-time simulation and role-based access control.

## Features

### Data Pipeline Monitoring
- **ETL Job Tracking**: Monitor pipeline execution status (PENDING, RUNNING, SUCCESS, FAILED)
- **Step-Level Breakdown**: View detailed execution steps with logs and timing
- **Retry Capabilities**: Admin users can retry failed pipelines
- **Records Processed**: Track data volume and throughput metrics
- **Environment Filtering**: Separate views for production, staging, and development

### API Observability
- **Latency Metrics**: P50, P95, and P99 latency tracking across regions
- **Error Rate Monitoring**: Real-time error percentage with alerting
- **Throughput Analysis**: Requests per minute with trend indicators
- **Regional Breakdown**: Performance metrics across 6 global regions
- **Time Range Filtering**: 1h, 24h, 7d, and 30d views

### Data Freshness & SLA Monitoring
- **Dataset Tracking**: Monitor refresh schedules for critical datasets
- **SLA Compliance**: Visual indicators for FRESH, DELAYED, and STALE status
- **Breach Notifications**: Automatic SLA breach detection
- **Priority Levels**: Critical, high, medium, and low priority classifications
- **Owner Assignment**: Track dataset ownership and responsibilities

### User Segmentation Analytics
- **Segment Performance**: Revenue, growth rate, and retention by segment
- **Regional Distribution**: Geographic user distribution with growth rates
- **Plan Analysis**: Free, Pro, and Enterprise plan breakdown
- **Cohort Retention**: Visual cohort analysis matrix
- **Churn Tracking**: Monitor user churn rates across segments

### Incident & Error Tracking
- **Incident Management**: Track active, investigating, resolved, and closed incidents
- **Severity Levels**: Critical, high, medium, and low severity classification
- **MTTR Metrics**: Mean Time To Resolve calculations
- **Service Health**: Error rates and health status by service
- **Error Distribution**: Breakdown by error type (runtime, timeout, database, etc.)

### Real-Time Simulation
- **Live Data Updates**: Simulated production environment with dynamic data
- **Pipeline Status Changes**: Jobs transition through states automatically
- **API Metrics Fluctuation**: Latency and error rates vary in real-time
- **Dataset Freshness Updates**: SLA compliance changes dynamically
- **Incident Lifecycle**: Active incidents can be resolved or escalate

### Role-Based Access Control
- **Admin Role**: Full access including retry pipelines, view logs, resolve incidents
- **Viewer Role**: Read-only access to dashboards and metrics
- **Conditional UI**: Components render based on user role
- **Role Switching**: Toggle between roles for testing (sidebar)

### User Experience
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Global Search**: Search across pipelines, datasets, and incidents
- **Responsive Design**: Collapsible sidebar, mobile-friendly navigation
- **KPI Dashboard**: Key metrics with trend indicators
- **Interactive Charts**: Line, area, bar, and pie charts with Recharts

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.7
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: TanStack Router (file-based)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd enterprise-analytics-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

The production build will be in the `dist` directory.

## Usage

### Dashboard Overview
1. View the main dashboard for high-level metrics
2. See active pipelines, data freshness status, and incidents
3. Monitor API latency trends with interactive charts
4. Click on any metric card to navigate to detailed views

### Monitor Pipelines
1. Navigate to **Pipelines** from the sidebar
2. View all ETL jobs with status, duration, and records processed
3. Filter by status: All, Running, Failed, Success
4. Click on any pipeline row to view detailed execution steps
5. Admin users can retry failed pipelines

### Track API Performance
1. Go to **API Monitoring** from the sidebar
2. Select time range: 1h, 24h, 7d, or 30d
3. View latency percentiles (P50, P95, P99) over time
4. Check error rates and throughput metrics
5. See regional distribution and top endpoints

### Check Data Freshness
1. Navigate to **Data Freshness** from the sidebar
4. Monitor SLA compliance rate and delayed datasets
5. View status overview with FRESH, DELAYED, and STALE counts

### Analyze User Segments
1. Go to **Segmentation** from the sidebar
2. View user growth trends and plan distribution
3. Analyze segment performance (revenue, retention, churn)
4. Check regional distribution
5. Review cohort retention analysis matrix

### Manage Incidents
1. Navigate to **Incidents** from the sidebar
2. View active incidents with severity and status
3. Check error distribution by type
4. Monitor service health across all services
5. Admin users can resolve incidents
6. View detailed error logs (Admin only)

### Switch Roles
1. Open the sidebar
2. Select role from dropdown: Admin or Viewer
3. UI updates automatically to show/hide admin features

### Toggle Theme
1. Click the sun/moon icon in the top header
2. Switch between dark and light modes
3. Preference persists across sessions

## Project Structure

```
src/
├── app/
│   └── globals.css           # Global styles and theme variables
├── components/
│   ├── charts/               # Recharts components (Line, Bar, Pie, MultiLine)
│   ├── layout/               # Sidebar, Header, Layout, ThemeProvider
│   ├── tables/               # Reusable Table component
│   └── ui/                   # UI primitives (Button, Card, Badge, etc.)
├── features/
│   ├── dashboard.tsx         # Main dashboard overview
│   ├── pipelines/            # Pipeline monitoring and detail views
│   ├── api-monitoring/       # API observability dashboard
│   ├── freshness/            # Data freshness & SLA tracking
│   ├── segmentation/         # User segmentation analytics
│   └── incidents/            # Incident and error tracking
├── hooks/
│   └── use-simulation.ts     # Real-time data simulation engine
├── mock-data/                # Realistic enterprise mock data
├── routes/                   # TanStack Router file-based routes
├── store/
│   └── app-store.ts          # Zustand state management
├── types/                    # TypeScript type definitions
├── utils/
│   └── formatting.ts         # Formatting utilities
├── App.tsx                   # Main application component
└── main.tsx                  # Application entry point
```

## Architecture Highlights

### Real-Time Simulation
- Deterministic pseudo-random data generation
- Simulates job failures, latency spikes, error bursts
- Automatic state transitions (PENDING → RUNNING → SUCCESS/FAIL)
- Memory-efficient interval management with cleanup

### State Management
- **Zustand**: Lightweight state management with devtools
- **Role-Based Store**: User role affects UI rendering
- **Simulation Toggle**: Enable/disable real-time updates
- **Mock Data**: Base state with realistic enterprise data

### Component Architecture
- **Feature-Based**: Each module is self-contained
- **Reusable Components**: Table, charts, cards, and badges
- **Strong Typing**: No `any` types, strict TypeScript
- **Responsive Design**: Mobile-first with Tailwind

### Data Visualization
- **Recharts**: Line, area, bar, and pie charts
- **Interactive Charts**: Tooltips, legends, and responsive sizing
- **Real-Time Updates**: Charts update as simulation runs
- **Multi-Line Support**: Overlay multiple metrics (P50, P95, P99)

### Theme System
- **CSS Variables**: HSL color values for easy theming
- **Dark Mode**: Comprehensive dark theme with good contrast
- **System Preference**: Automatic detection of OS theme
- **Persistent**: Theme preference saved to localStorage

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Supports modern browsers with ES2020+ features

## Performance

- **Vite**: Fast HMR and optimized builds
- **Code Splitting**: Route-based splitting with TanStack Router
- **Efficient Rendering**: Zustand selectors prevent unnecessary re-renders
- **Optimized Charts**: Recharts with minimal DOM updates
- **CSS-First**: Tailwind v4 with CSS variables for zero-runtime theming

## Development

### Code Quality

```bash
# Type checking
pnpm tsc

# Build
pnpm build

# Preview production build
pnpm preview
```

### Environment Variables

No environment variables are required. The app uses mock data and simulation.

## Deployment

### Vercel

Connect your GitHub repository to Vercel for automatic deployments:

```bash
vercel
```

### Netlify

Deploy using:

```bash
netlify deploy --prod --dir=dist
```

### Static Hosting

The `dist` folder contains static files that can be served from any CDN or web server.

## License

MIT

## Acknowledgments

- **TanStack**: Router, Query, and Table libraries
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Composable charting library
- **Lucide**: Beautiful icon library
- **Zustand**: Minimal state management

---

Built as a portfolio project demonstrating enterprise-grade frontend development practices.
