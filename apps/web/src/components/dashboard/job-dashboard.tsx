"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { client } from "@/lib/sanity/client";
import { JOB_DETAIL_QUERY } from "@/lib/sanity/query";
import { 
  BarChart3, 
  Users, 
  Package, 
  Briefcase,
  RefreshCw
} from "lucide-react";

import { SummaryCards } from "./summary-cards";
import { JobListTable } from "./job-list-table";
import { JobDetailModal } from "./job-detail-modal";
import { MetalAnalytics } from "./metal-analytics";
import { CustomerAnalytics } from "./customer-analytics";

interface JobDashboardProps {
  summaryData: any;
  jobsData: any[];
  metalData: any;
  customerData: any;
  isLoading?: boolean;
}

export function JobDashboard({ 
  summaryData, 
  jobsData, 
  metalData, 
  customerData, 
  isLoading = false 
}: JobDashboardProps) {
  const handleRefresh = () => {
    window.location.reload();
  };
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "metals" | "customers">("overview");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isLoadingJobDetails, setIsLoadingJobDetails] = useState(false);

  // Ensure data exists and has required properties
  const safeJobsData = jobsData || [];
  const safeSummaryData = summaryData || {
    totalJobs: 0,
    completedJobs: 0,
    inProgressJobs: 0,
    cancelledJobs: 0,
    allJobs: [],
    recentJobs: []
  };
  const safeMetalData = metalData || { metalTypes: [], metalUsage: [] };
  const safeCustomerData = customerData || { totalCustomers: 0, customersWithJobs: 0, topCustomers: [] };

  const handleJobSelect = async (jobId: string) => {
    setSelectedJobId(jobId);
    setIsLoadingJobDetails(true);
    try {
      // Fetch the full job details including images
      const jobDetails = await client.fetch(JOB_DETAIL_QUERY, { jobId });
      setSelectedJob(jobDetails);
    } catch (error) {
      console.error('Error fetching job details:', error);
      // Fallback to basic job data if fetch fails
      const job = safeJobsData.find(j => j._id === jobId);
      setSelectedJob(job);
    } finally {
      setIsLoadingJobDetails(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedJobId(null);
    setSelectedJob(null);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "metals", label: "Metals", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and analyze your e-waste pickup jobs
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <SummaryCards data={safeSummaryData} />
        )}

        {activeTab === "jobs" && (
          <JobListTable 
            jobs={safeJobsData} 
            onJobSelect={handleJobSelect}
          />
        )}

        {activeTab === "metals" && (
          <MetalAnalytics data={safeMetalData} />
        )}

        {activeTab === "customers" && (
          <CustomerAnalytics data={safeCustomerData} />
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJobId}
        onClose={handleCloseModal}
        isLoading={isLoadingJobDetails}
      />
    </div>
  );
}
