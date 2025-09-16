import { Suspense } from "react";
import { auth } from "@/auth";
import { client } from "@/lib/sanity/client";
import { 
  JOBS_DASHBOARD_SUMMARY_QUERY, 
  JOBS_LIST_QUERY, 
  METAL_ANALYTICS_QUERY, 
  CUSTOMER_ANALYTICS_QUERY 
} from "@/lib/sanity/query";
import { JobDashboard } from "@/components/dashboard";

async function DashboardContent() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  // Fetch all dashboard data in parallel
  const [summaryData, jobsData, metalData, customerData] = await Promise.all([
    client.fetch(JOBS_DASHBOARD_SUMMARY_QUERY),
    client.fetch(JOBS_LIST_QUERY),
    client.fetch(METAL_ANALYTICS_QUERY),
    client.fetch(CUSTOMER_ANALYTICS_QUERY),
  ]);

  // Provide default values to prevent undefined errors
  const safeSummaryData = summaryData || {
    totalJobs: 0,
    completedJobs: 0,
    inProgressJobs: 0,
    cancelledJobs: 0,
    allJobs: [],
    recentJobs: []
  };

  const safeJobsData = jobsData || [];
  const safeMetalData = metalData || { metalTypes: [], metalUsage: [] };
  const safeCustomerData = customerData || { totalCustomers: 0, customersWithJobs: 0, topCustomers: [] };

  return (
    <div className="container mx-auto py-6">
      <JobDashboard
        summaryData={safeSummaryData}
        jobsData={safeJobsData}
        metalData={safeMetalData}
        customerData={safeCustomerData}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
