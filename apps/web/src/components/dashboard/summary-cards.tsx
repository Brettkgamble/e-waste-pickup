"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { formatDisplayDate } from "@/lib/utils/date";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Scale, 
  TrendingUp,
  XCircle,
  Users
} from "lucide-react";

interface DashboardSummary {
  totalJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  cancelledJobs: number;
  allJobs: Array<{
    totalWeight?: number;
    totalPurchasePrice?: number;
  }>;
  recentJobs: Array<{
    _id: string;
    name: string;
    jobId: string;
    status: string;
    totalWeight: number;
    totalPurchasePrice: number;
    dateCreated: string;
    customerCount: number;
  }>;
}

interface SummaryCardsProps {
  data: DashboardSummary;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  // Ensure data exists and has required properties
  const safeData = {
    totalJobs: data?.totalJobs || 0,
    completedJobs: data?.completedJobs || 0,
    inProgressJobs: data?.inProgressJobs || 0,
    cancelledJobs: data?.cancelledJobs || 0,
    allJobs: data?.allJobs || [],
    recentJobs: data?.recentJobs || []
  };

  // Calculate totals from allJobs array
  const totalWeight = safeData.allJobs.reduce((sum, job) => sum + (job?.totalWeight || 0), 0);
  const totalRevenue = safeData.allJobs.reduce((sum, job) => sum + (job?.totalPurchasePrice || 0), 0);
  const averageJobValue = safeData.allJobs.length > 0 ? totalRevenue / safeData.allJobs.length : 0;
  
  const completionRate = safeData.totalJobs > 0 ? (safeData.completedJobs / safeData.totalJobs) * 100 : 0;

  const cards = [
    {
      title: "Total Jobs",
      value: safeData.totalJobs,
      icon: Briefcase,
      description: "All jobs created",
      trend: null,
    },
    {
      title: "Completed Jobs",
      value: safeData.completedJobs,
      icon: CheckCircle,
      description: `${completionRate.toFixed(1)}% completion rate`,
      trend: completionRate > 80 ? "positive" : completionRate > 60 ? "neutral" : "negative",
    },
    {
      title: "In Progress",
      value: safeData.inProgressJobs,
      icon: Clock,
      description: "Currently active",
      trend: null,
    },
    {
      title: "Total Weight",
      value: `${totalWeight.toLocaleString()} lbs`,
      icon: Scale,
      description: "Metal processed",
      trend: null,
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "From all jobs",
      trend: null,
    },
    {
      title: "Avg Job Value",
      value: `$${Math.round(averageJobValue).toLocaleString()}`,
      icon: TrendingUp,
      description: "Per completed job",
      trend: null,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
                {card.trend && (
                  <div className="flex items-center mt-2">
                    <div className={`text-xs ${
                      card.trend === "positive" ? "text-green-600" : 
                      card.trend === "negative" ? "text-red-600" : 
                      "text-yellow-600"
                    }`}>
                      {card.trend === "positive" ? "↗" : 
                       card.trend === "negative" ? "↘" : "→"}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeData.recentJobs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent jobs found</p>
            ) : (
              safeData.recentJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{job.name}</h4>
                      {getStatusBadge(job.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Job ID: {job.jobId} • {job.customerCount} customer{job.customerCount !== 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Weight: {job.totalWeight?.toLocaleString() || 0} lbs</span>
                      <span>Value: ${job.totalPurchasePrice?.toLocaleString() || 0}</span>
                      <span>{formatDisplayDate(job.dateCreated)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
