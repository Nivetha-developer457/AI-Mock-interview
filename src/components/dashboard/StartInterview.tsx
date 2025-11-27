"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Target, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface StartInterviewProps {
  userId: number;
}

const popularRoles = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "Marketing Manager",
  "Business Analyst",
  "DevOps Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Mobile Developer",
  "QA Engineer",
  "Project Manager",
  "Sales Representative",
  "Customer Success Manager"
];

const timePerQuestionOptions = [
  { value: "60", label: "1 minute" },
  { value: "120", label: "2 minutes" },
  { value: "180", label: "3 minutes" },
  { value: "240", label: "4 minutes" },
  { value: "300", label: "5 minutes" }
];

const totalDurationOptions = [
  { value: "600", label: "10 minutes" },
  { value: "900", label: "15 minutes" },
  { value: "1200", label: "20 minutes" },
  { value: "1800", label: "30 minutes" },
  { value: "2700", label: "45 minutes" },
  { value: "3600", label: "60 minutes" }
];

export default function StartInterview({ userId }: StartInterviewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<any>(null);
  const [suggestedRole, setSuggestedRole] = useState<string>("");
  
  const [formData, setFormData] = useState({
    role: "",
    timePerQuestion: "180",
    totalDuration: "1800",
    useAISuggestion: false
  });

  useEffect(() => {
    loadResume();
  }, [userId]);

  const loadResume = async () => {
    try {
      const response = await fetch(`/api/resumes?userId=${userId}`);
      const resumes = await response.json();
      if (resumes.length > 0) {
        const latestResume = resumes[0];
        setResume(latestResume);
        
        // Set suggested role from resume analysis
        if (latestResume.suggestedRoles && latestResume.suggestedRoles.length > 0) {
          setSuggestedRole(latestResume.suggestedRoles[0]);
        }
      }
    } catch (error) {
      console.error("Error loading resume:", error);
    }
  };

  const handleStartInterview = async () => {
    if (!formData.role || formData.role === "none") {
      toast.error("Please select a role for the interview");
      return;
    }

    setLoading(true);

    try {
      // Create interview record
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId: resume?.id || null,
          role: formData.role,
          timePerQuestion: parseInt(formData.timePerQuestion),
          totalDuration: parseInt(formData.totalDuration),
          status: "in_progress"
        })
      });

      if (response.ok) {
        const interview = await response.json();
        toast.success("Interview session created!");
        
        // Navigate to interview interface
        router.push(`/interview/${interview.id}`);
      } else {
        throw new Error("Failed to create interview");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      toast.error("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestion = () => {
    if (suggestedRole) {
      setFormData({ ...formData, role: suggestedRole, useAISuggestion: true });
      toast.success(`AI suggests: ${suggestedRole}`);
    } else {
      toast.error("Please upload your resume first for AI suggestions");
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Configure Your Interview
          </CardTitle>
          <CardDescription>
            Set up your mock interview parameters for a realistic practice session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="role">Target Role</Label>
              {resume && suggestedRole && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAISuggestion}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Use AI Suggestion
                </Button>
              )}
            </div>
            
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {suggestedRole && (
                  <>
                    <SelectItem value={suggestedRole}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {suggestedRole} (AI Suggested)
                      </div>
                    </SelectItem>
                    <SelectItem value="separator" disabled>
                      ──────────
                    </SelectItem>
                  </>
                )}
                {popularRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.useAISuggestion && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary">AI Recommendation</p>
                  <p className="text-muted-foreground">
                    Based on your resume analysis, this role matches your skills and experience
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Time per Question */}
          <div className="space-y-3">
            <Label htmlFor="timePerQuestion" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time per Question
            </Label>
            <Select
              value={formData.timePerQuestion}
              onValueChange={(value) => setFormData({ ...formData, timePerQuestion: value })}
            >
              <SelectTrigger id="timePerQuestion">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timePerQuestionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Time limit for answering each question
            </p>
          </div>

          {/* Total Duration */}
          <div className="space-y-3">
            <Label htmlFor="totalDuration" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Total Interview Duration
            </Label>
            <Select
              value={formData.totalDuration}
              onValueChange={(value) => setFormData({ ...formData, totalDuration: value })}
            >
              <SelectTrigger id="totalDuration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {totalDurationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Maximum length of the entire interview session
            </p>
          </div>

          {/* Interview Preview */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="font-semibold text-sm">Interview Preview:</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">{formData.role || "Not selected"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {totalDurationOptions.find(o => o.value === formData.totalDuration)?.label}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Time/Question</p>
                <p className="font-medium">
                  {timePerQuestionOptions.find(o => o.value === formData.timePerQuestion)?.label}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Est. Questions</p>
                <p className="font-medium">
                  ~{Math.floor(parseInt(formData.totalDuration) / parseInt(formData.timePerQuestion))}
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleStartInterview}
            disabled={loading || !formData.role || formData.role === "none"}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Starting Interview...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Start Interview
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resume Suggestion Card */}
      {!resume && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Upload your resume for better results</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Get AI-powered role suggestions and personalized questions based on your experience
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard?tab=resume")}
                >
                  Upload Resume
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interview Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2">
            <Badge variant="secondary" className="h-fit">1</Badge>
            <p>Find a quiet space with good lighting for video recording</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="h-fit">2</Badge>
            <p>Allow camera and microphone permissions when prompted</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="h-fit">3</Badge>
            <p>Practice STAR method (Situation, Task, Action, Result) for answers</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="h-fit">4</Badge>
            <p>Speak clearly and maintain eye contact with the camera</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="h-fit">5</Badge>
            <p>Take your time to think before answering each question</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}