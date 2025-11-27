"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { TrendingUp, Users, Clock, Award, Target } from "lucide-react";

export default function AnalyticsDashboard() {
  const monthlyData = [
    { month: "Jan", interviews: 45, users: 120 },
    { month: "Feb", interviews: 52, users: 145 },
    { month: "Mar", interviews: 61, users: 178 },
    { month: "Apr", interviews: 78, users: 210 },
    { month: "May", interviews: 89, users: 245 },
    { month: "Jun", interviews: 95, users: 289 }
  ];

  const performanceData = [
    { name: "Excellent", value: 45, color: "#8b5cf6" },
    { name: "Good", value: 30, color: "#6366f1" },
    { name: "Average", value: 15, color: "#818cf8" },
    { name: "Poor", value: 10, color: "#c4b5fd" }
  ];

  const roleDistribution = [
    { role: "Software Engineer", count: 342 },
    { role: "Product Manager", count: 189 },
    { role: "Data Scientist", count: 156 },
    { role: "UX Designer", count: 134 },
    { role: "DevOps Engineer", count: 98 }
  ];

  const metrics = [
    {
      icon: Users,
      title: "Total Interviews",
      value: "2,847",
      change: "+18.2%",
      description: "Completed this month"
    },
    {
      icon: Clock,
      title: "Avg Duration",
      value: "24 min",
      change: "-3.1%",
      description: "Per interview session"
    },
    {
      icon: Award,
      title: "Success Rate",
      value: "87.3%",
      change: "+5.4%",
      description: "Users improved"
    },
    {
      icon: Target,
      title: "Completion Rate",
      value: "92.1%",
      change: "+2.8%",
      description: "Finished interviews"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {metric.change}
                </Badge>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Interviews and user growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="interviews" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
            <CardDescription>Interview outcomes by performance level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Job Roles</CardTitle>
          <CardDescription>Most selected roles for interview practice</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers This Month</CardTitle>
          <CardDescription>Users with highest interview scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Sarah Johnson", role: "Software Engineer", score: 98, interviews: 12 },
              { name: "Michael Chen", role: "Data Scientist", score: 96, interviews: 15 },
              { name: "Emily Davis", role: "Product Manager", score: 94, interviews: 10 },
              { name: "James Wilson", role: "UX Designer", score: 92, interviews: 8 },
              { name: "Lisa Anderson", role: "DevOps Engineer", score: 90, interviews: 11 }
            ].map((performer, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">{performer.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{performer.score}%</p>
                  <p className="text-xs text-muted-foreground">{performer.interviews} interviews</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}