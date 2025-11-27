"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Video, 
  BarChart3, 
  Clock, 
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
  Play
} from "lucide-react";
import ResumeUpload from "@/components/dashboard/ResumeUpload";
import InterviewHistory from "@/components/dashboard/InterviewHistory";
import PerformanceStats from "@/components/dashboard/PerformanceStats";
import StartInterview from "@/components/dashboard/StartInterview";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    topRole: "",
    hoursSpent: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    loadUserStats(userData.id);
  }, [router]);

  const loadUserStats = async (userId: number) => {
    try {
      // Fetch user's interviews
      const response = await fetch(`/api/interviews?userId=${userId}`);
      const interviews = await response.json();
      
      if (Array.isArray(interviews) && interviews.length > 0) {
        // Fetch evaluations
        const evalResponse = await fetch(`/api/evaluations?userId=${userId}`);
        const evaluations = await evalResponse.json();
        
        const avgScore = evaluations.length > 0
          ? evaluations.reduce((sum: number, e: any) => sum + e.overallScore, 0) / evaluations.length
          : 0;
        
        // Find most common role
        const roleCounts = interviews.reduce((acc: any, i: any) => {
          acc[i.role] = (acc[i.role] || 0) + 1;
          return acc;
        }, {});
        const topRole = Object.keys(roleCounts).reduce((a, b) => 
          roleCounts[a] > roleCounts[b] ? a : b, "");
        
        // Calculate total time spent
        const totalSeconds = interviews.reduce((sum: number, i: any) => 
          sum + (i.actualDuration || 0), 0);
        const hoursSpent = Math.round(totalSeconds / 3600 * 10) / 10;
        
        setStats({
          totalInterviews: interviews.length,
          avgScore: Math.round(avgScore),
          topRole,
          hoursSpent
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user.fullName}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to practice and improve your interview skills?
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Interviews</CardDescription>
                <CardTitle className="text-3xl">{stats.totalInterviews}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Video className="h-4 w-4 mr-1" />
                  Practice sessions
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Average Score</CardDescription>
                <CardTitle className="text-3xl">{stats.avgScore}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={stats.avgScore} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Top Role</CardDescription>
                <CardTitle className="text-2xl">{stats.topRole || "N/A"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Target className="h-4 w-4 mr-1" />
                  Most practiced
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Time Spent</CardDescription>
                <CardTitle className="text-3xl">{stats.hoursSpent}h</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  Practice time
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="start" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="start">
                <Play className="h-4 w-4 mr-2" />
                Start Interview
              </TabsTrigger>
              <TabsTrigger value="resume">
                <Upload className="h-4 w-4 mr-2" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="history">
                <Calendar className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="performance">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="start">
              <StartInterview userId={user.id} />
            </TabsContent>

            <TabsContent value="resume">
              <ResumeUpload userId={user.id} />
            </TabsContent>

            <TabsContent value="history">
              <InterviewHistory userId={user.id} />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceStats userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}