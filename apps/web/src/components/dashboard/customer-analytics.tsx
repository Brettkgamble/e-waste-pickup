"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { formatDisplayDate } from "@/lib/utils/date";
import { 
  Users, 
  Building, 
  Mail, 
  Phone, 
  Calendar,
  TrendingUp,
  DollarSign,
  MapPin
} from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  companyName?: string;
  email: string;
  jobCount: number;
  jobs: Array<{
    totalPurchasePrice?: number;
    dateCreated: string;
  }>;
}

interface CustomerAnalyticsData {
  totalCustomers: number;
  customersWithJobs: number;
  topCustomers: Customer[];
}

interface CustomerAnalyticsProps {
  data: CustomerAnalyticsData;
}

export function CustomerAnalytics({ data }: CustomerAnalyticsProps) {
  // Ensure data exists and has required properties
  const safeData = {
    totalCustomers: data?.totalCustomers || 0,
    customersWithJobs: data?.customersWithJobs || 0,
    topCustomers: data?.topCustomers || []
  };

  // Calculate totalSpent and lastJobDate for each customer
  const customersWithTotals = safeData.topCustomers.map(customer => {
    const jobs = customer.jobs || [];
    return {
      ...customer,
      totalSpent: jobs.reduce((sum, job) => sum + (job?.totalPurchasePrice || 0), 0),
      lastJobDate: jobs.length > 0 && jobs[0] 
        ? jobs[0].dateCreated // Jobs are already ordered by dateCreated desc
        : ''
    };
  });

  const customerEngagementRate = safeData.totalCustomers > 0 
    ? (safeData.customersWithJobs / safeData.totalCustomers) * 100 
    : 0;

  const averageJobsPerCustomer = safeData.customersWithJobs > 0 
    ? customersWithTotals.reduce((sum, customer) => sum + customer.jobCount, 0) / safeData.customersWithJobs 
    : 0;

  const averageSpentPerCustomer = safeData.customersWithJobs > 0 
    ? customersWithTotals.reduce((sum, customer) => sum + customer.totalSpent, 0) / safeData.customersWithJobs 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeData.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeData.customersWithJobs}</div>
            <p className="text-xs text-muted-foreground">
              {customerEngagementRate.toFixed(1)}% engagement rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Jobs/Customer
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageJobsPerCustomer.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Per active customer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Spent/Customer
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSpentPerCustomer.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per active customer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Engagement Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Engagement Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Engagement Rate</h4>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-primary"
                    style={{ width: `${customerEngagementRate}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {customerEngagementRate.toFixed(1)}% of customers have completed jobs
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Customers with jobs</span>
                  <span className="font-medium">{safeData.customersWithJobs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customers without jobs</span>
                  <span className="font-medium">{safeData.totalCustomers - safeData.customersWithJobs}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Customer Value Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>High-value customers (5+ jobs)</span>
                    <span className="font-medium">
                      {customersWithTotals.filter(c => c.jobCount >= 5).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Regular customers (2-4 jobs)</span>
                    <span className="font-medium">
                      {customersWithTotals.filter(c => c.jobCount >= 2 && c.jobCount < 5).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>One-time customers</span>
                    <span className="font-medium">
                      {customersWithTotals.filter(c => c.jobCount === 1).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Customers by Job Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customersWithTotals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No customer data available</p>
            ) : (
              customersWithTotals.map((customer, index) => (
                <div key={customer._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{customer.name}</h4>
                        {customer.companyName && (
                          <Badge variant="outline" className="text-xs">
                            <Building className="h-3 w-3 mr-1" />
                            {customer.companyName}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Last job: {formatDisplayDate(customer.lastJobDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-medium">{customer.jobCount}</div>
                        <div className="text-xs text-muted-foreground">jobs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">${customer.totalSpent.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">total spent</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Value Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Customer Value Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customersWithTotals.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${Math.max(...customersWithTotals.map(c => c.totalSpent)).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Highest value customer</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.max(...customersWithTotals.map(c => c.jobCount))}
                    </div>
                    <div className="text-sm text-muted-foreground">Most jobs by one customer</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ${(customersWithTotals.reduce((sum, c) => sum + c.totalSpent, 0) / customersWithTotals.length).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Average customer value</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Customer Value Distribution</h4>
                  <div className="space-y-1">
                    {customersWithTotals.map((customer) => {
                      const maxValue = Math.max(...customersWithTotals.map(c => c.totalSpent));
                      const percentage = (customer.totalSpent / maxValue) * 100;
                      return (
                        <div key={customer._id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{customer.name}</span>
                            <span>${customer.totalSpent.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
