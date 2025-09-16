# Job Dashboard Components

This directory contains the components for the e-waste pickup job dashboard, providing comprehensive analytics and management capabilities.

## Components

### JobDashboard
The main dashboard component that orchestrates all other components. Features:
- Tabbed interface for different views (Overview, Jobs, Metals, Customers)
- Refresh functionality
- Modal management for job details

### SummaryCards
Displays high-level metrics and recent jobs:
- Total jobs count
- Completion rates
- Revenue and weight totals
- Recent jobs list with quick stats

### JobListTable
Interactive table for job management:
- Sortable columns (name, status, weight, value, date)
- Status filtering
- Drill-down capability to job details
- Customer and metal count indicators

### JobDetailModal
Comprehensive job detail view with tabs:
- **Overview**: Job information, processes, related blog posts
- **Metals**: Detailed metal entries with images and pricing
- **Customers**: Customer information and contact details
- **Images**: Job-related images gallery

### MetalAnalytics
Metal processing analytics:
- Metal type breakdown with visual charts
- Top performing metals by value
- Available metal types inventory
- Weight and value distribution

### CustomerAnalytics
Customer engagement analytics:
- Customer engagement rates
- Top customers by job count and value
- Customer value distribution
- Average metrics per customer

## Data Flow

1. **Admin Page** (`/admin`) fetches data using GROQ queries
2. **JobDashboard** receives all data and manages state
3. **Individual components** receive specific data slices
4. **JobDetailModal** provides drill-down functionality

## GROQ Queries

The dashboard uses several optimized GROQ queries:
- `JOBS_DASHBOARD_SUMMARY_QUERY`: High-level metrics
- `JOBS_LIST_QUERY`: Job list with basic info
- `JOB_DETAIL_QUERY`: Complete job details for modal
- `METAL_ANALYTICS_QUERY`: Metal usage and type data
- `CUSTOMER_ANALYTICS_QUERY`: Customer engagement data

## Features

### Drill-Down Capability
- Click any job in the table to view detailed information
- Modal provides comprehensive job details across multiple tabs
- Easy navigation between different data views

### Real-time Updates
- Refresh button to reload all data
- Loading states for better UX
- Error handling for failed requests

### Responsive Design
- Mobile-friendly layout
- Adaptive grid systems
- Touch-friendly interactions

### Analytics
- Visual charts and progress bars
- Comparative metrics
- Trend indicators
- Export-ready data presentation

## Usage

```tsx
import { JobDashboard } from "@/components/dashboard";

<JobDashboard
  summaryData={summaryData}
  jobsData={jobsData}
  metalData={metalData}
  customerData={customerData}
  onRefresh={handleRefresh}
  isLoading={isLoading}
/>
```

## Dependencies

- Next.js 15
- Sanity CMS
- Lucide React icons
- Tailwind CSS
- Custom UI components from `@workspace/ui`
