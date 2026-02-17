# Enterprise Analytics Dashboard

A production-grade frontend-only enterprise analytics dashboard that simulates a real-world data engineering and business intelligence platform. Monitor ETL pipelines, API performance, data freshness, user segmentation, and incidents with real-time simulation and role-based access control.

## Features

### Data Pipeline Monitoring
- **ETL Job Tracking**: Monitor pipeline execution status (PENDING, RUNNING, SUCCESS, FAILED)
- **Step-Level Breakdown**: View detailed execution steps with logs and timing
- **Retry Capabilities**: Admin users can retry failed pipelines
- **Bulk Retry**: Select and retry multiple failed pipelines at once
- **Favorites**: Bookmark frequently accessed pipelines for quick access
- **Records Processed**: Track data volume and throughput metrics
- **Environment Filtering**: Separate views for production, staging, and development
- **CSV Export**: Export pipeline data to CSV format

### API Observability
- **Latency Metrics**: P50, P95, and P99 latency tracking across regions
- **Error Rate Monitoring**: Real-time error percentage with alerting
- **Throughput Analysis**: Requests per minute with trend indicators
- **Regional Breakdown**: Performance metrics across 6 global regions
- **Time Range Filtering**: 1h, 24h, 7d, and 30d views
- **Chart Zoom/Pan**: Interactive charts with zoom and pan capabilities

### Data Freshness & SLA Monitoring
- **Dataset Tracking**: Monitor refresh schedules for critical datasets
- **SLA Compliance**: Visual indicators for FRESH, DELAYED, and STALE status
- **Breach Notifications**: Automatic SLA breach detection with activity logging
- **Priority Levels**: Critical, high, medium, and low priority classifications
- **Owner Assignment**: Track dataset ownership and responsibilities
- **CSV Export**: Export dataset freshness data to CSV format
- **URL State Persistence**: Share filtered views with URL parameters

### User Segmentation Analytics
- **Segment Performance**: Revenue, growth rate, and retention by segment
- **Regional Distribution**: Geographic user distribution with growth rates
- **Plan Analysis**: Free, Pro, and Enterprise plan breakdown
- **Cohort Retention**: Visual cohort analysis matrix
- **Churn Tracking**: Monitor user churn rates across segments

### Incident & Error Tracking
- **Incident Management**: Track active, investigating, resolved, and closed incidents
- **Bulk Resolution**: Resolve multiple incidents simultaneously
- **Severity Levels**: Critical, high, medium, and low severity classification
- **MTTR Metrics**: Mean Time To Resolve calculations
- **Service Health**: Error rates and health status by service
- **Error Distribution**: Breakdown by error type (runtime, timeout, database, etc.)
- **CSV Export**: Export incidents and error logs to CSV format

### Health Score & System Monitoring
- **Overall Health Score**: 0-100% system health indicator
- **Component Breakdown**: Individual scores for pipelines, datasets, incidents, and API
- **Visual Progress Bars**: Real-time health visualization
- **Performance Monitor**: Development-mode FPS, memory, and DOM node tracking

### Real-Time Simulation
- **Live Data Updates**: Simulated production environment with dynamic data
- **Pipeline Status Changes**: Jobs transition through states automatically
- **API Metrics Fluctuation**: Latency and error rates vary in real-time
- **Dataset Freshness Updates**: SLA compliance changes dynamically
- **Incident Lifecycle**: Active incidents can be resolved or escalate
- **Activity Feed**: Real-time logging of all system events

### Keyboard Shortcuts
- **Navigation**: g+d (Dashboard), g+p (Pipelines), g+a (API), g+f (Freshness), g+s (Segmentation), g+i (Incidents)
- **Actions**: / (Focus search), t (Toggle theme), r (Refresh), ? (Show shortcuts)
- **Quick Access**: Press ? anywhere to view all available shortcuts

### User Experience
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Auto Dark Mode**: Automatically switches to dark mode from 8 PM to 6 AM
- **Global Search**: Search across pipelines, datasets, and incidents
- **Responsive Design**: Collapsible sidebar, mobile-friendly navigation
- **KPI Dashboard**: Key metrics with trend indicators and tooltip explanations
- **Interactive Charts**: Line, area, bar, and pie charts with Recharts
- **Virtual Scrolling**: Toggle between paginated and virtual scroll for large tables
- **Data Refresh Indicator**: Shows last update time with animated refresh icon
- **Recent Activity Feed**: Real-time activity tracking with severity indicators

### Error Handling & Performance
- **Error Boundaries**: Graceful error handling with retry functionality
- **Performance Monitoring**: FPS, memory usage, and DOM node tracking (dev mode)
- **Efficient Rendering**: Memoized computations and optimized re-renders
- **URL State Persistence**: Filter states persist in URL for shareable links

### Role-Based Access Control
- **Admin Role**: Full access including retry pipelines, view logs, resolve incidents
- **Viewer Role**: Read-only access to dashboards and metrics
- **Conditional UI**: Components render based on user role
- **Role Switching**: Toggle between roles for testing (sidebar)

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.7
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: TanStack Router (file-based)
- **State Management**: Zustand with devtools
- **Data Fetching**: TanStack Query
- **Charts**: Recharts with zoom/pan capabilities
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
4. Check system health score and recent activity feed
5. Access favorite pipelines quickly
6. Use comparative analytics to compare periods
7. Click on any metric card to navigate to detailed views

### Keyboard Shortcuts
1. Press `?` to view all available shortcuts
2. Use `g+d` to go to Dashboard, `g+p` for Pipelines, etc.
3. Press `/` to focus the search bar
4. Press `t` to toggle between light and dark themes
5. Press `r` to refresh the page

### Monitor Pipelines
1. Navigate to **Pipelines** from the sidebar
2. View all ETL jobs with status, duration, and records processed
3. Filter by status: All, Running, Failed, Success
4. Toggle "Favorites" to show only bookmarked pipelines
5. Select multiple failed pipelines and click "Retry Failed"
6. Click the star icon to add/remove favorites
7. Click on any pipeline row to view detailed execution steps
8. Use the "Export CSV" button to download pipeline data

### Track API Performance
1. Go to **API Monitoring** from the sidebar
2. Select time range: 1h, 24h, 7d, or 30d
3. View latency percentiles (P50, P95, P99) over time
4. Use chart brush/zoom to focus on specific time periods
5. Check error rates and throughput metrics
6. See regional distribution and top endpoints

### Check Data Freshness
1. Navigate to **Data Freshness** from the sidebar
2. Filter by status: All, Fresh, Delayed, or Stale
3. Monitor SLA compliance rate and delayed datasets
4. View status overview with FRESH, DELAYED, and STALE counts
5. Export dataset information to CSV

### Analyze User Segments
1. Go to **Segmentation** from the sidebar
2. View user growth trends and plan distribution
3. Analyze segment performance (revenue, retention, churn)
4. Check regional distribution
5. Review cohort retention analysis matrix

### Manage Incidents
1. Navigate to **Incidents** from the sidebar
2. Filter incidents by status: All, Active, or Resolved
3. Select multiple active incidents and click "Resolve Selected"
4. View active incidents with severity and status
5. Check error distribution by type
6. Monitor service health across all services
7. Admin users can resolve individual or bulk incidents
8. View detailed error logs (Admin only)
9. Export incidents and errors to CSV

### Switch Roles
1. Open the sidebar
2. Select role from dropdown: Admin or Viewer
3. UI updates automatically to show/hide admin features

### Toggle Theme
1. Click the sun/moon icon in the top header
2. Switch between dark and light modes manually
3. Or enable "Auto" mode in Settings to switch automatically (8 PM - 6 AM)
4. Preference persists across sessions

## Project Structure

```
src/
├── app/
│   └── globals.css           # Global styles and theme variables
├── components/
│   ├── charts/               # Recharts components with zoom/pan
│   ├── error-boundary.tsx    # Error boundary for graceful error handling
│   ├── health-score.tsx      # System health score component
│   ├── keyboard-shortcuts-help.tsx  # Keyboard shortcuts modal
│   ├── recent-activity.tsx   # Activity feed component
│   ├── data-refresh-indicator.tsx  # Live update indicator
│   ├── layout/               # Sidebar, Header, Layout, ThemeProvider
│   ├── tables/               # Enhanced Table with export, selection, pagination
│   └── ui/                   # UI primitives (Button, Card, Badge, Checkbox, etc.)
├── features/
│   ├── about/                # About page with feature documentation
│   ├── dashboard.tsx         # Main dashboard with health score and activity
│   ├── pipelines/            # Pipeline monitoring with favorites and bulk actions
│   ├── api-monitoring/       # API observability dashboard
│   ├── freshness/            # Data freshness & SLA tracking
│   ├── segmentation/         # User segmentation analytics
│   └── incidents/            # Incident tracking with bulk resolution
├── hooks/
│   ├── use-keyboard-shortcuts.ts   # Keyboard navigation hooks
│   ├── use-performance-monitoring.tsx  # Performance metrics tracking
│   ├── use-simulation.ts     # Real-time data simulation engine
│   └── use-theme.ts          # Theme management hook
├── mock-data/                # Realistic enterprise mock data
├── routes/                   # TanStack Router file-based routes
├── store/
│   └── app-store.ts          # Zustand state management with activity tracking
├── types/
│   ├── activity.ts           # Activity log types
│   └── ...                   # Other TypeScript type definitions
├── utils/
│   ├── export.ts             # CSV export utilities
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
- Activity logging for all state changes

### State Management
- **Zustand**: Lightweight state management with devtools
- **Activity Tracking**: All actions logged with timestamps
- **Role-Based Store**: User role affects UI rendering
- **Simulation Toggle**: Enable/disable real-time updates
- **Favorites**: Persistent pipeline bookmarks
- **Mock Data**: Base state with realistic enterprise data

### Component Architecture
- **Feature-Based**: Each module is self-contained
- **Reusable Components**: Table, charts, cards, and badges
- **Error Boundaries**: Graceful error handling at component level
- **Strong Typing**: Strict TypeScript throughout
- **Responsive Design**: Mobile-first with Tailwind

### Data Visualization
- **Recharts**: Line, area, bar, and pie charts
- **Interactive Charts**: Tooltips, legends, zoom/pan, and responsive sizing
- **Real-Time Updates**: Charts update as simulation runs
- **Multi-Line Support**: Overlay multiple metrics (P50, P95, P99)

### Theme System
- **CSS Variables**: HSL color values for easy theming
- **Dark Mode**: Comprehensive dark theme with good contrast
- **Auto Mode**: Automatic switching based on time (8 PM - 6 AM)
- **System Preference**: Automatic detection of OS theme
- **Persistent**: Theme preference saved to localStorage

### Performance Optimizations
- **Memoization**: Expensive computations cached with useMemo
- **Callback Optimization**: Event handlers memoized with useCallback
- **Efficient Rendering**: Zustand selectors prevent unnecessary re-renders
- **Virtual Scrolling**: Optional virtual scroll for large tables
- **Performance Monitor**: Development-mode FPS and memory tracking

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
