"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  FileText,
  Clock,
  BarChart3,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    inProgressInterviews: 0,
    avgDuration: 0,
    popularRoles: [] as { role: string; count: number }[],
    monthlyTrend: [] as { month: string; count: number }[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/interviews");
      const interviews = await response.json();

      const completed = interviews.filter((i: any) => i.status === 'completed').length;
      const inProgress = interviews.filter((i: any) => i.status === 'in_progress').length;

      // Calculate popular roles
      const roleCounts: Record<string, number> = {};
      interviews.forEach((i: any) => {
        if (i.role) {
          roleCounts[i.role] = (roleCounts[i.role] || 0) + 1;
        }
      });
      const popularRoles = Object.entries(roleCounts)
        .map(([role, count]) => ({ role, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setAnalytics({
        totalInterviews: interviews.length,
        completedInterviews: completed,
        inProgressInterviews: inProgress,
        avgDuration: 0,
        popularRoles,
        monthlyTrend: []
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-sm text-muted-foreground">Interview statistics and insights</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Interviews
              </CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalInterviews}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.completedInterviews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.totalInterviews > 0 
                  ? `${((analytics.completedInterviews / analytics.totalInterviews) * 100).toFixed(1)}% completion rate`
                  : 'No data'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
              <Clock className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.inProgressInterviews}</div>
              <p className="text-xs text-muted-foreground mt-1">Active sessions</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Duration
              </CardTitle>
              <Calendar className="h-5 w-5 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground mt-1">Minutes per interview</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Popular Roles */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Popular Job Roles</CardTitle>
              <CardDescription>Most frequently interviewed positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularRoles.map((role, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{role.role}</p>
                        <p className="text-xs text-muted-foreground">{role.count} interviews</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{role.count}</Badge>
                  </div>
                ))}
                {analytics.popularRoles.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Interview completion metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm font-bold">
                      {analytics.totalInterviews > 0 
                        ? `${((analytics.completedInterviews / analytics.totalInterviews) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ 
                        width: analytics.totalInterviews > 0 
                          ? `${(analytics.completedInterviews / analytics.totalInterviews) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Active Sessions</span>
                    <span className="text-sm font-bold">
                      {analytics.totalInterviews > 0 
                        ? `${((analytics.inProgressInterviews / analytics.totalInterviews) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary transition-all"
                      style={{ 
                        width: analytics.totalInterviews > 0 
                          ? `${(analytics.inProgressInterviews / analytics.totalInterviews) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Sessions</p>
                      <p className="text-2xl font-bold">{analytics.totalInterviews}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">
                        {analytics.totalInterviews > 0 ? '100%' : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}