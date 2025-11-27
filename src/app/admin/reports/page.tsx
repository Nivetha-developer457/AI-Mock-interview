"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Users,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Reports() {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("last-30-days");
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    {
      id: "users",
      title: "User Activity Report",
      description: "Detailed report on user registrations and activity",
      icon: Users,
      color: "primary"
    },
    {
      id: "interviews",
      title: "Interview Performance Report",
      description: "Statistics on interview completions and scores",
      icon: FileText,
      color: "secondary"
    },
    {
      id: "analytics",
      title: "Platform Analytics Report",
      description: "Comprehensive analytics on platform usage",
      icon: BarChart3,
      color: "accent"
    },
    {
      id: "monthly",
      title: "Monthly Summary Report",
      description: "Month-over-month performance comparison",
      icon: Calendar,
      color: "chart-4"
    }
  ];

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast.error("Please select a report type");
      return;
    }

    setGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would generate and download a PDF/CSV
      toast.success("Report generated successfully");
      
      // Trigger download
      const blob = new Blob(["Sample Report Data"], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-report-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast.error("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Reports</h1>
                <p className="text-sm text-muted-foreground">Generate and download platform reports</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Generator */}
        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Select report type and date range to generate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerateReport} 
              disabled={generating}
              className="w-full md:w-auto"
            >
              {generating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="grid md:grid-cols-2 gap-6">
          {reportTypes.map((type) => (
            <Card 
              key={type.id} 
              className={`border-2 cursor-pointer transition-colors ${
                reportType === type.id ? 'border-primary' : 'hover:border-primary'
              }`}
              onClick={() => setReportType(type.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`h-12 w-12 rounded-lg bg-${type.color}/10 flex items-center justify-center mb-4`}>
                    <type.icon className={`h-6 w-6 text-${type.color}`} />
                  </div>
                  {reportType === type.id && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card className="border-2 mt-8">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">User Activity Report</p>
                    <p className="text-xs text-muted-foreground">Generated 2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                No recent reports
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}