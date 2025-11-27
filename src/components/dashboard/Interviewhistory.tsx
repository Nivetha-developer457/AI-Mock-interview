"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Target, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface InterviewHistoryProps {
  userId: number;
}

export default function InterviewHistory({ userId }: InterviewHistoryProps) {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadInterviews();
  }, [userId]);

  const loadInterviews = async () => {
    try {
      const [interviewsRes, evaluationsRes] = await Promise.all([
        fetch(`/api/interviews?userId=${userId}&status=completed`),
        fetch(`/api/evaluations?userId=${userId}`)
      ]);

      const interviewsData = await interviewsRes.json();
      const evaluationsData = await evaluationsRes.json();

      setInterviews(interviewsData);
      setEvaluations(evaluationsData);
    } catch (error) {
      console.error("Error loading interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEvaluationForInterview = (interviewId: number) => {
    return evaluations.find(e => e.interviewId === interviewId);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreTrend = (score: number, avgScore: number) => {
    if (score > avgScore) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (score < avgScore) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interview History</CardTitle>
          <CardDescription>Loading your past interviews...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (interviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interview History</CardTitle>
          <CardDescription>Your completed interviews will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">No interviews yet</p>
            <p className="text-muted-foreground mb-6">
              Start your first mock interview to see your history here
            </p>
            <Button onClick={() => router.push("/dashboard?tab=start")}>
              Start Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgScore = evaluations.length > 0
    ? evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview History</CardTitle>
        <CardDescription>
          {interviews.length} completed interview{interviews.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviews.map((interview) => {
          const evaluation = getEvaluationForInterview(interview.id);
          const score = evaluation?.overallScore || 0;
          
          return (
            <Card key={interview.id} className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{interview.role}</h3>
                      <Badge variant="secondary">
                        {interview.status}
                      </Badge>
                      {evaluation && (
                        <span className={`text-xl font-bold ${getScoreColor(score)}`}>
                          {score}%
                        </span>
                      )}
                      {evaluation && getScoreTrend(score, avgScore)}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(interview.startedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(interview.actualDuration || interview.totalDuration)}
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {interview.timePerQuestion}s per question
                      </div>
                    </div>

                    {evaluation && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Communication</p>
                          <p className="font-semibold">{evaluation.communicationScore}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                          <p className="font-semibold">{evaluation.confidenceScore}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Technical</p>
                          <p className="font-semibold">{evaluation.technicalAccuracyScore}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Resume Fit</p>
                          <p className="font-semibold">{evaluation.resumeAlignmentScore}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Personality</p>
                          <p className="font-semibold">{evaluation.personalityFitScore}%</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/interview/${interview.id}/results`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}