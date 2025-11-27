"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar as CalendarIcon, TrendingUp, Users, Award } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ReportsPanel() {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  const reportTypes = [
    {
      id: "user-activity",
      title: "User Activity Report",
      description: "Detailed user engagement and activity metrics",
      icon: Users
    },
    {
      id: "interview-performance",
      title: "Interview Performance Report",
      description: "Analysis of interview scores and trends",
      icon: Award
    },
    {
      id: "system-analytics",
      title: "System Analytics Report",
      description: "Overall platform usage and statistics",
      icon: TrendingUp
    },
    {
      id: "monthly-summary",
      title: "Monthly Summary Report",
      description: "Comprehensive monthly performance overview",
      icon: FileText
    }
  ];

  const recentReports = [
    {
      name: "User Activity - March 2024",
      type: "User Activity",
      date: "2024-03-31",
      size: "2.4 MB"
    },
    {
      name: "Interview Performance - Q1 2024",
      type: "Performance Analysis",
      date: "2024-03-28",
      size: "1.8 MB"
    },
    {
      name: "System Analytics - March 2024",
      type: "System Analytics",
      date: "2024-03-25",
      size: "3.1 MB"
    },
    {
      name: "Monthly Summary - February 2024",
      type: "Monthly Summary",
      date: "2024-02-29",
      size: "4.2 MB"
    }
  ];

  const handleGenerateReport = () => {
    if (!reportType) {
      toast.error("Please select a report type");
      return;
    }
    toast.success("Report generation started. You'll be notified when it's ready.");
  };

  const handleDownloadReport = (reportName: string) => {
    toast.success(`Downloading ${reportName}...`);
  };

  return (
    <div className="space-y-6">
      {/* Generate New Report */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>Create custom reports for analysis and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            {reportTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  reportType === type.id ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setReportType(type.id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <type.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{type.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {type.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Date Range and Filters */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports available for download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {report.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(report.date), "MMM dd, yyyy")} • {report.size}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport(report.name)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reports Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Most Popular Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">User Activity</div>
            <p className="text-xs text-muted-foreground mt-1">89 downloads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg. Generation Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 min</div>
            <p className="text-xs text-muted-foreground mt-1">-15% faster</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}