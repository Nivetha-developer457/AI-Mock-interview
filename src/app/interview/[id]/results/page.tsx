"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  TrendingUp,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Home,
  FileText,
  BarChart3
} from "lucide-react";

interface Evaluation {
  id: number;
  interview_id: number;
  communication_score: number;
  technical_score: number;
  confidence_score: number;
  overall_score: number;
  strengths: string;
  improvements: string;
  feedback: string;
  created_at: string;
}

export default function InterviewResults() {
  const params = useParams();
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluation();
  }, []);

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/evaluations?interview_id=${params.id}`);
      const data = await response.json();
      if (data.length > 0) {
        setEvaluation(data[0]);
      }
    } catch (error) {
      console.error("Error fetching evaluation:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>
              We couldn't find evaluation results for this interview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scores = [
    {
      label: "Communication",
      score: evaluation.communication_score,
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      label: "Technical Skills",
      score: evaluation.technical_score,
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      label: "Confidence",
      score: evaluation.confidence_score,
      icon: Sparkles,
      color: "text-pink-600"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", variant: "default" as const };
    if (score >= 75) return { label: "Good", variant: "secondary" as const };
    if (score >= 60) return { label: "Average", variant: "secondary" as const };
    return { label: "Needs Improvement", variant: "destructive" as const };
  };

  const strengthsList = evaluation.strengths.split(",").map(s => s.trim()).filter(Boolean);
  const improvementsList = evaluation.improvements.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Interview Complete!</h1>
          <p className="text-muted-foreground text-lg">Here's your detailed performance evaluation</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Overall Score */}
        <Card className="border-2 border-primary/50 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Overall Score</CardTitle>
            <div className="flex items-center justify-center gap-4">
              <div className={`text-6xl font-bold ${getScoreColor(evaluation.overall_score)}`}>
                {evaluation.overall_score}%
              </div>
              <Badge variant={getScoreBadge(evaluation.overall_score).variant} className="text-lg px-4 py-2">
                {getScoreBadge(evaluation.overall_score).label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={evaluation.overall_score} className="h-3" />
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {scores.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <CardTitle className="text-lg">{item.label}</CardTitle>
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(item.score)}`}>
                  {item.score}%
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={item.score} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Feedback */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <CardTitle>Strengths</CardTitle>
              </div>
              <CardDescription>What you did well</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {strengthsList.length > 0 ? (
                  strengthsList.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">No specific strengths recorded</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <CardTitle>Areas for Improvement</CardTitle>
              </div>
              <CardDescription>Where you can grow</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {improvementsList.length > 0 ? (
                  improvementsList.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-yellow-600 mt-1 flex-shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">No specific improvements suggested</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Feedback</CardTitle>
            <CardDescription>Comprehensive evaluation from our AI interviewer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {evaluation.feedback || "No detailed feedback available."}
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => router.push("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/dashboard")}>
            <FileText className="mr-2 h-4 w-4" />
            Start New Interview
          </Button>
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Review your strengths and keep practicing them</li>
              <li>• Focus on the improvement areas in your next practice session</li>
              <li>• Try different roles to expand your interview skills</li>
              <li>• Practice regularly to build confidence and consistency</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}