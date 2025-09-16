"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { 
  Package, 
  Scale, 
  DollarSign, 
  TrendingUp,
  BarChart3
} from "lucide-react";

interface MetalType {
  _id: string;
  name: string;
  type: string;
  currentPricePerPound: number;
  unit: string;
  isActive: string;
}

interface MetalUsage {
  metals: Array<{
    metal: {
      _id: string;
      name: string;
      type: string;
    };
    weight: number;
    purchasePrice: number;
  }>;
}

interface MetalAnalyticsData {
  metalTypes: MetalType[];
  metalUsage: MetalUsage[];
}

interface MetalAnalyticsProps {
  data: MetalAnalyticsData;
}

export function MetalAnalytics({ data }: MetalAnalyticsProps) {
  // Ensure data exists and has required properties
  const safeData = {
    metalTypes: data?.metalTypes || [],
    metalUsage: data?.metalUsage || []
  };

  // Process metal usage data
  const metalStats = safeData.metalUsage.reduce((acc, job) => {
    job.metals.forEach(metalEntry => {
      const metalId = metalEntry.metal._id;
      const metalName = metalEntry.metal.name;
      const metalType = metalEntry.metal.type;
      
      if (!acc[metalId]) {
        acc[metalId] = {
          name: metalName,
          type: metalType,
          totalWeight: 0,
          totalValue: 0,
          jobCount: 0,
          averagePricePerPound: 0
        };
      }
      
      acc[metalId].totalWeight += metalEntry.weight;
      acc[metalId].totalValue += metalEntry.purchasePrice;
      acc[metalId].jobCount += 1;
    });
    return acc;
  }, {} as Record<string, {
    name: string;
    type: string;
    totalWeight: number;
    totalValue: number;
    jobCount: number;
    averagePricePerPound: number;
  }>);

  // Calculate average price per pound for each metal
  Object.values(metalStats).forEach(metal => {
    metal.averagePricePerPound = metal.totalWeight > 0 ? metal.totalValue / metal.totalWeight : 0;
  });

  const sortedMetals = Object.values(metalStats).sort((a, b) => b.totalValue - a.totalValue);
  const totalWeight = Object.values(metalStats).reduce((sum, metal) => sum + (metal?.totalWeight || 0), 0);
  const totalValue = Object.values(metalStats).reduce((sum, metal) => sum + (metal?.totalValue || 0), 0);

  // Group by metal type
  const typeStats = Object.values(metalStats).reduce((acc, metal) => {
    if (!acc[metal.type]) {
      acc[metal.type] = {
        type: metal.type,
        totalWeight: 0,
        totalValue: 0,
        metalCount: 0
      };
    }
    const typeEntry = acc[metal.type];
    if (typeEntry) {
      typeEntry.totalWeight += metal.totalWeight;
      typeEntry.totalValue += metal.totalValue;
      typeEntry.metalCount += 1;
    }
    return acc;
  }, {} as Record<string, {
    type: string;
    totalWeight: number;
    totalValue: number;
    metalCount: number;
  }>);

  const getMetalTypeBadge = (type: string) => {
    switch (type) {
      case "ferrous":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Ferrous</Badge>;
      case "non-ferrous":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Non-Ferrous</Badge>;
      case "precious":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Precious</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ferrous":
        return "bg-gray-500";
      case "non-ferrous":
        return "bg-yellow-500";
      case "precious":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Metals Processed
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeData.metalTypes.length}</div>
            <p className="text-xs text-muted-foreground">
              Different metal types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Weight
            </CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight.toLocaleString()} lbs</div>
            <p className="text-xs text-muted-foreground">
              Across all jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From metal processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Metal Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Metal Type Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(typeStats).map((type) => {
              const percentage = totalWeight > 0 ? (type.totalWeight / totalWeight) * 100 : 0;
              return (
                <div key={type.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{type.type}</span>
                      {getMetalTypeBadge(type.type)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {type.metalCount} metal{type.metalCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{type.totalWeight.toLocaleString()} lbs</span>
                      <span>${type.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getTypeColor(type.type)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% of total weight
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Metals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Metals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMetals.slice(0, 10).map((metal, index) => (
              <div key={metal.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{metal.name}</div>
                    <div className="flex items-center gap-2">
                      {getMetalTypeBadge(metal.type)}
                      <span className="text-sm text-muted-foreground">
                        {metal.jobCount} job{metal.jobCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${metal.totalValue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {metal.totalWeight.toLocaleString()} lbs
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${metal.averagePricePerPound.toFixed(2)}/lb avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Metal Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Available Metal Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeData.metalTypes.map((metal) => (
              <div key={metal._id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{metal.name}</h4>
                  <Badge variant={metal.isActive === "active" ? "default" : "secondary"}>
                    {metal.isActive}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {getMetalTypeBadge(metal.type)}
                  </div>
                  <div>${metal.currentPricePerPound}/{metal.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
