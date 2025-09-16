"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { formatDisplayDate } from "@/lib/utils/date";
import { 
  Eye, 
  Calendar, 
  Scale, 
  DollarSign, 
  Users, 
  Package,
  Image as ImageIcon,
  Settings
} from "lucide-react";
import { useState } from "react";

interface Job {
  _id: string;
  name: string;
  jobId: string;
  description?: string;
  status: string;
  totalWeight?: number;
  totalPurchasePrice?: number;
  dateCreated: string;
  dateCompleted?: string;
  customers: Array<{
    _id: string;
    name: string;
    companyName?: string;
    email: string;
    phone?: string;
  }>;
  metalCount: number;
  processCount: number;
  imageCount: number;
}

interface JobListTableProps {
  jobs: Job[];
  onJobSelect: (jobId: string) => void;
}

export function JobListTable({ jobs, onJobSelect }: JobListTableProps) {
  const [sortField, setSortField] = useState<keyof Job>("dateCreated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Ensure jobs is an array
  const safeJobs = jobs || [];

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

  const handleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredJobs = safeJobs.filter(job => 
    filterStatus === "all" || job.status === filterStatus
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const statusOptions = [
    { value: "all", label: "All Jobs" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Jobs Overview
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th 
                  className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  Job Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("totalWeight")}
                >
                  Weight {sortField === "totalWeight" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("totalPurchasePrice")}
                >
                  Value {sortField === "totalPurchasePrice" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("dateCreated")}
                >
                  Created {sortField === "dateCreated" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left p-3 font-medium">Details</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No jobs found
                  </td>
                </tr>
              ) : (
                sortedJobs.map((job) => (
                  <tr key={job._id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{job.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {job.jobId}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        <span>{job.totalWeight?.toLocaleString() || 0} lbs</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${job.totalPurchasePrice?.toLocaleString() || 0}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDisplayDate(job.dateCreated)}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{job.customers.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{job.metalCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          <span>{job.imageCount}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onJobSelect(job._id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {sortedJobs.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {sortedJobs.length} of {safeJobs.length} jobs
          </div>
        )}
      </CardContent>
    </Card>
  );
}
