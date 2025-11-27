"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Award, Target, BarChart3, AlertCircle } from "lucide-react";

interface PerformanceStatsProps {
  userId: number;
}

export default function PerformanceStats({ userId }: PerformanceStatsProps) {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    loadPerformanceData();
  }, [userId]);

  const loadPerformanceData = async () => {
    try {
      const [evaluationsRes, interviewsRes] = await Promise.all([
        fetch(`/api/evaluations?userId=${userId}`),
        fetch(`/api/interviews?userId=${userId}&status=completed`)
      ]);

      const evaluationsData = await evaluationsRes.json();
      const interviewsData = await interviewsRes.json();

      setEvaluations(evaluationsData);
      setInterviews(interviewsData);
    } catch (error) {
      console.error("Error loading performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>No performance data available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">Complete your first interview</p>
            <p className="text-muted-foreground">
              Your performance statistics will appear here after completing interviews
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const avgScores = {
    communication: Math.round(evaluations.reduce((sum, e) => sum + e.communicationScore, 0) / evaluations.length),
    confidence: Math.round(evaluations.reduce((sum, e) => sum + e.confidenceScore, 0) / evaluations.length),
    technical: Math.round(evaluations.reduce((sum, e) => sum + e.technicalAccuracyScore, 0) / evaluations.length),
    resumeAlignment: Math.round(evaluations.reduce((sum, e) => sum + e.resumeAlignmentScore, 0) / evaluations.length),
    personality: Math.round(evaluations.reduce((sum, e) => sum + e.personalityFitScore, 0) / evaluations.length),
    overall: Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length)
  };

  // Get trend (comparing recent vs older interviews)
  const recentEvals = evaluations.slice(0, Math.ceil(evaluations.length / 2));
  const olderEvals = evaluations.slice(Math.ceil(evaluations.length / 2));
  
  const recentAvg = recentEvals.length > 0
    ? recentEvals.reduce((sum, e) => sum + e.overallScore, 0) / recentEvals.length
    : 0;
  const olderAvg = olderEvals.length > 0
    ? olderEvals.reduce((sum, e) => sum + e.overallScore, 0) / olderEvals.length
    : 0;
  
  const trend = recentAvg > olderAvg ? "up" : recentAvg < olderAvg ? "down" : "stable";
  const trendValue = Math.abs(Math.round(recentAvg - olderAvg));

  // Collect all strengths and weaknesses
  const allStrengths = evaluations.flatMap(e => e.strengths || []);
  const allWeaknesses = evaluations.flatMap(e => e.weaknesses || []);
  
  // Count occurrences
  const strengthCounts = allStrengths.reduce((acc: any, s: string) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  
  const weaknessCounts = allWeaknesses.reduce((acc: any, w: string) => {
    acc[w] = (acc[w] || 0) + 1;
    return acc;
  }, {});
  
  const topStrengths = Object.entries(strengthCounts)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5)
    .map(([strength]) => strength);
  
  const topWeaknesses = Object.entries(weaknessCounts)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5)
    .map(([weakness]) => weakness);

  // Role performance
  const roleStats = interviews.reduce((acc: any, interview) => {
    const evaluation = evaluations.find(e => e.interviewId === interview.id);
    if (evaluation) {
      if (!acc[interview.role]) {
        acc[interview.role] = { count: 0, totalScore: 0 };
      }
      acc[interview.role].count++;
      acc[interview.role].totalScore += evaluation.overallScore;
    }
    return acc;
  }, {});

  const rolePerformance = Object.entries(roleStats).map(([role, stats]: any) => ({
    role,
    avgScore: Math.round(stats.totalScore / stats.count),
    interviews: stats.count
  })).sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="space-y-6">
      {/* Overall Performance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Overall Performance
          </CardTitle>
          <CardDescription>
            Based on {evaluations.length} completed interview{evaluations.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-4xl font-bold">{avgScores.overall}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            {trend !== "stable" && (
              <div className={`flex items-center gap-2 ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {trend === "up" ? <TrendingUp className="h-8 w-8" /> : <TrendingDown className="h-8 w-8" />}
                <div>
                  <p className="text-2xl font-bold">{trendValue}%</p>
                  <p className="text-xs">{trend === "up" ? "Improvement" : "Decline"}</p>
                </div>
              </div>
            )}
          </div>
          <Progress value={avgScores.overall} className="h-3" />
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
          <CardDescription>Average performance across different criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Communication</span>
              <span className="font-semibold">{avgScores.communication}%</span>
            </div>
            <Progress value={avgScores.communication} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence</span>
              <span className="font-semibold">{avgScores.confidence}%</span>
            </div>
            <Progress value={avgScores.confidence} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Technical Accuracy</span>
              <span className="font-semibold">{avgScores.technical}%</span>
            </div>
            <Progress value={avgScores.technical} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Resume Alignment</span>
              <span className="font-semibold">{avgScores.resumeAlignment}%</span>
            </div>
            <Progress value={avgScores.resumeAlignment} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Personality Fit</span>
              <span className="font-semibold">{avgScores.personality}%</span>
            </div>
            <Progress value={avgScores.personality} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Role Performance */}
      {rolePerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Performance by Role
            </CardTitle>
            <CardDescription>Your scores across different job roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rolePerformance.map((rp, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{rp.role}</p>
                  <p className="text-xs text-muted-foreground">
                    {rp.interviews} interview{rp.interviews !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{rp.avgScore}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {topStrengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Strengths
            </CardTitle>
            <CardDescription>Areas where you consistently perform well</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topStrengths.map((strength, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {strength}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Areas for Improvement */}
      {topWeaknesses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>Focus on these to improve your scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topWeaknesses.map((weakness, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {weakness}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}