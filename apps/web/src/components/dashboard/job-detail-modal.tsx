"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { formatDisplayDate } from "@/lib/utils/date";
import { 
  X, 
  Calendar, 
  Scale, 
  DollarSign, 
  Users, 
  Package,
  Image as ImageIcon,
  Settings,
  MapPin,
  Phone,
  Mail,
  FileText,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";

interface JobDetail {
  _id: string;
  name: string;
  jobId: string;
  description?: string;
  status: string;
  totalWeight?: number;
  totalPurchasePrice?: number;
  dateCreated: string;
  dateCompleted?: string;
  images: Array<{
    _id: string;
    asset: {
      url: string;
      alt: string;
      blurData?: string;
      dominantColor?: string;
    };
  }>;
  customers: Array<{
    _id: string;
    name: string;
    companyName?: string;
    email: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    notes?: string;
  }>;
  metals: Array<{
    _key: string;
    weight: number;
    purchasePrice: number;
    notes?: string;
    metal: {
      _id: string;
      name: string;
      type: string;
      currentPricePerPound: number;
      unit: string;
    };
    images: Array<{
      _id: string;
      asset: {
        url: string;
        alt: string;
        blurData?: string;
        dominantColor?: string;
      };
    }>;
  }>;
  processes: Array<{
    _id: string;
    name: string;
    description?: string;
  }>;
  relatedBlogPosts: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
}

interface JobDetailModalProps {
  job: JobDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function JobDetailModal({ job, isOpen, onClose, isLoading = false }: JobDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "metals" | "customers" | "images">("overview");

  // Ensure job exists and has required properties
  const safeJob = job ? {
    ...job,
    processes: job.processes || [],
    metals: job.metals || [],
    customers: job.customers || [],
    images: job.images || [],
    relatedBlogPosts: job.relatedBlogPosts || []
  } : null;

  // Debug logging
  if (safeJob && safeJob.images) {
    console.log('Job images data:', safeJob.images);
    console.log('First image:', safeJob.images[0]);
    if (safeJob.images[0]) {
      console.log('First image asset:', safeJob.images[0].asset);
      console.log('Generated URL:', urlFor(safeJob.images[0]).url());
    }
  }

  if (!isOpen || !safeJob) return null;

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

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "metals", label: "Metals", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "images", label: "Images", icon: ImageIcon },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">{safeJob.name}</h2>
            <p className="text-muted-foreground">Job ID: {safeJob.jobId}</p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(safeJob.status)}
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-1 p-4">
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading job details...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Job Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {safeJob.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{safeJob.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Weight: <strong>{safeJob.totalWeight?.toLocaleString() || 0} lbs</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Value: <strong>${safeJob.totalPurchasePrice?.toLocaleString() || 0}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Created: <strong>{formatDisplayDate(safeJob.dateCreated)}</strong></span>
                    </div>
                  </div>

                  {safeJob.dateCompleted && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Completed: <strong>{formatDisplayDate(safeJob.dateCompleted)}</strong></span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Processes */}
              {safeJob.processes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Processes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {safeJob.processes.map((process) => (
                        <div key={process._id} className="p-3 border rounded-lg">
                          <h4 className="font-medium">{process.name}</h4>
                          {process.description && (
                            <p className="text-sm text-muted-foreground mt-1">{process.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Blog Posts */}
              {safeJob.relatedBlogPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Blog Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {safeJob.relatedBlogPosts.map((post) => (
                        <a
                          key={post._id}
                          href={`/blog/${post.slug}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {post.title}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "metals" && (
            <div className="space-y-4">
              {safeJob.metals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No metals recorded for this job</p>
              ) : (
                safeJob.metals.map((metalEntry) => (
                  <Card key={metalEntry._key}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{metalEntry.metal.name}</CardTitle>
                        {getMetalTypeBadge(metalEntry.metal.type)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-muted-foreground" />
                          <span><strong>{metalEntry.weight}</strong> {metalEntry.metal.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span><strong>${metalEntry.purchasePrice.toLocaleString()}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Rate: <strong>${metalEntry.metal.currentPricePerPound}/{metalEntry.metal.unit}</strong>
                          </span>
                        </div>
                      </div>
                      
                      {metalEntry.notes && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-1">Notes</h4>
                          <p className="text-sm text-muted-foreground">{metalEntry.notes}</p>
                        </div>
                      )}

                      {(metalEntry.images || []).length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Images</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {(metalEntry.images || []).map((image) => (
                              <div key={image._id} className="relative aspect-square rounded-lg overflow-hidden">
                                <Image
                                  src={urlFor(image).url()}
                                  alt={image.asset?.alt || 'Metal image'}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === "customers" && (
            <div className="space-y-4">
              {safeJob.customers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No customers associated with this job</p>
              ) : (
                safeJob.customers.map((customer) => (
                  <Card key={customer._id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {customer.name}
                        {customer.companyName && (
                          <Badge variant="outline" className="ml-2">{customer.companyName}</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{customer.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        {customer.address && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div className="text-sm">
                                {customer.address.street && <div>{customer.address.street}</div>}
                                {(customer.address.city || customer.address.state) && (
                                  <div>
                                    {customer.address.city && customer.address.city}
                                    {customer.address.city && customer.address.state && ", "}
                                    {customer.address.state && customer.address.state}
                                    {customer.address.zipCode && ` ${customer.address.zipCode}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {customer.notes && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-1">Notes</h4>
                          <p className="text-sm text-muted-foreground">{customer.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === "images" && (
            <div className="space-y-4">
              {safeJob.images.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No images for this job</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {safeJob.images.map((image) => (
                    <div key={image._id} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={urlFor(image).url()}
                        alt={image.asset?.alt || 'Job image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
