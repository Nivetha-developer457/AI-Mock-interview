"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  Clock,
  Activity,
  Download,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    activeToday: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, interviewsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/interviews")
      ]);

      const users = await usersRes.json();
      const interviews = await interviewsRes.json();

      const completed = interviews.filter((i: any) => i.status === 'completed').length;
      const completionRate = interviews.length > 0 
        ? ((completed / interviews.length) * 100).toFixed(1)
        : 0;

      setStats({
        totalUsers: users.length,
        totalInterviews: interviews.length,
        activeToday: 0,
        completionRate: Number(completionRate)
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const adminSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      color: "primary",
      href: "/admin/users",
      stats: `${stats.totalUsers} users`
    },
    {
      title: "Analytics",
      description: "View platform statistics and insights",
      icon: BarChart3,
      color: "secondary",
      href: "/admin/analytics",
      stats: `${stats.completionRate}% completion rate`
    },
    {
      title: "Reports",
      description: "Generate and download reports",
      icon: FileText,
      color: "accent",
      href: "/admin/reports",
      stats: "Export data"
    },
    {
      title: "Settings",
      description: "Configure platform settings",
      icon: Settings,
      color: "chart-4",
      href: "/admin/settings",
      stats: "System config"
    }
  ];

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
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your AI Interview Coach platform</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary">+0</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Interviews
              </CardTitle>
              <FileText className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalInterviews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-secondary">+0</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Today
              </CardTitle>
              <Activity className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeToday}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Current active users
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Interview success rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Administration</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {adminSections.map((section, index) => (
              <Link key={index} href={section.href}>
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`h-12 w-12 rounded-lg bg-${section.color}/10 flex items-center justify-center mb-4`}>
                        <section.icon className={`h-6 w-6 text-${section.color}`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                    <div className="pt-2">
                      <Badge variant="secondary">{section.stats}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">System initialized</p>
                  <p className="text-xs text-muted-foreground">Admin panel is ready to use</p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-center py-6 text-muted-foreground">
                No recent activity
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}