"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  Video,
  Mic,
  MicOff,
  VideoOff
} from "lucide-react";
import { toast } from "sonner";
import AvatarDisplay from "@/components/interview/AvatarDisplay";
import WebcamRecorder from "@/components/interview/WebcamRecorder";
import Timer from "@/components/interview/Timer";

export default function InterviewPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = parseInt(params.id as string);
  
  const [interview, setInterview] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<"neutral" | "smile" | "thinking" | "nodding">("neutral");

  useEffect(() => {
    loadInterview();
    requestPermissions();
  }, [interviewId]);

  useEffect(() => {
    if (interview && questions.length === 0) {
      generateQuestions();
    }
  }, [interview]);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionsGranted(true);
    } catch (error) {
      toast.error("Camera and microphone access required for interview");
    }
  };

  const loadInterview = async () => {
    try {
      const response = await fetch(`/api/interviews?id=${interviewId}`);
      if (response.ok) {
        const data = await response.json();
        setInterview(data);
        setTotalTimeRemaining(data.totalDuration);
        setTimeRemaining(data.timePerQuestion);
      } else {
        throw new Error("Interview not found");
      }
    } catch (error) {
      console.error("Error loading interview:", error);
      toast.error("Failed to load interview");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = async () => {
    if (!interview) return;

    setAvatarEmotion("thinking");
    
    try {
      // Call backend API to generate AI-powered questions
      const response = await fetch(`/api/interviews/${interviewId}/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate questions");
      }

      const data = await response.json();
      setQuestions(data.questions);
      setAvatarEmotion("smile");
      toast.success(`${data.count} questions generated successfully!`);
    } catch (error: any) {
      console.error("Error generating questions:", error);
      toast.error(error.message || "Failed to generate questions");
      setAvatarEmotion("neutral");
      
      // Fallback to dashboard if generation fails
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  const startRecording = () => {
    if (!permissionsGranted) {
      toast.error("Please grant camera and microphone permissions");
      return;
    }

    setIsRecording(true);
    setQuestionStartTime(Date.now());
    setAvatarEmotion("nodding");
    
    // Start countdown timer
    const questionTimer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(questionTimer);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const totalTimer = setInterval(() => {
      setTotalTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(totalTimer);
          finishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
    setAvatarEmotion(isPaused ? "nodding" : "neutral");
  };

  const handleNextQuestion = async () => {
    // Save answer timing
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      // In production, this would save the actual answer text from speech-to-text
      await fetch(`/api/questions?id=${currentQuestion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answerText: "User provided answer via voice recording",
          timeTaken,
          answeredAt: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(interview.timePerQuestion);
      setQuestionStartTime(Date.now());
      setAvatarEmotion("smile");
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    setIsRecording(false);
    setAvatarEmotion("smile");
    
    toast.success("Interview completed! Generating evaluation...");

    try {
      // Update interview status
      await fetch(`/api/interviews?id=${interviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          actualDuration: interview.totalDuration - totalTimeRemaining,
          completedAt: new Date().toISOString()
        })
      });

      // Generate mock evaluation
      const mockEvaluation = {
        interviewId,
        userId: interview.userId,
        communicationScore: Math.floor(Math.random() * 20) + 75,
        confidenceScore: Math.floor(Math.random() * 20) + 70,
        technicalAccuracyScore: Math.floor(Math.random() * 20) + 75,
        resumeAlignmentScore: Math.floor(Math.random() * 20) + 80,
        personalityFitScore: Math.floor(Math.random() * 20) + 75,
        overallScore: Math.floor(Math.random() * 20) + 75,
        strengths: [
          "Clear communication",
          "Good examples provided",
          "Confident delivery",
          "Relevant experience"
        ],
        weaknesses: [
          "Could elaborate more on technical details",
          "Limited discussion of challenges"
        ],
        improvementSuggestions: [
          "Practice STAR method responses",
          "Prepare more specific examples",
          "Research company background"
        ],
        roleFitRecommendation: `Good fit for ${interview.role} position. Strong communication skills and relevant experience demonstrated.`
      };

      await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockEvaluation)
      });

      // Navigate to results
      setTimeout(() => {
        router.push(`/interview/${interviewId}/results`);
      }, 2000);
    } catch (error) {
      console.error("Error finishing interview:", error);
      toast.error("Failed to save interview results");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!interview || !permissionsGranted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Permissions Required</h2>
              <p className="text-muted-foreground mb-4">
                Please grant camera and microphone access to continue with the interview.
              </p>
              <Button onClick={requestPermissions}>
                Grant Permissions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{interview.role} Interview</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Timer 
                timeRemaining={timeRemaining}
                totalTime={interview.timePerQuestion}
                label="Question Time"
              />
              <Timer 
                timeRemaining={totalTimeRemaining}
                totalTime={interview.totalDuration}
                label="Total Time"
                variant="secondary"
              />
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
        </div>
      </div>

      {/* Main Interview Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Avatar Section */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <AvatarDisplay emotion={avatarEmotion} />
              </CardContent>
            </Card>

            {/* Current Question */}
            {currentQuestion && (
              <Card className="border-2 border-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {currentQuestionIndex + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-medium leading-relaxed">
                        {currentQuestion.questionText}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recording Section */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <WebcamRecorder isRecording={isRecording} isPaused={isPaused} />
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording}
                      size="lg"
                      className="w-full"
                      disabled={questions.length === 0}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button 
                          onClick={pauseRecording}
                          variant="outline"
                          className="flex-1"
                        >
                          {isPaused ? (
                            <>
                              <Play className="h-5 w-5 mr-2" />
                              Resume
                            </>
                          ) : (
                            <>
                              <Pause className="h-5 w-5 mr-2" />
                              Pause
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={handleNextQuestion}
                          className="flex-1"
                        >
                          <SkipForward className="h-5 w-5 mr-2" />
                          Next Question
                        </Button>
                      </div>
                      
                      {currentQuestionIndex === questions.length - 1 && (
                        <Button 
                          onClick={finishInterview}
                          variant="secondary"
                          className="w-full"
                        >
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Finish Interview
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Status Indicators */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      {isRecording ? (
                        <Video className="h-4 w-4 text-green-500" />
                      ) : (
                        <VideoOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-muted-foreground">Camera</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {isRecording ? (
                        <Mic className="h-4 w-4 text-green-500" />
                      ) : (
                        <MicOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-muted-foreground">Microphone</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> Take a moment to think before answering. 
                  Use the STAR method (Situation, Task, Action, Result) for structured responses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}