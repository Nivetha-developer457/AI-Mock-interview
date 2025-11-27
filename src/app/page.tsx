"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import AuthDialog from "@/components/AuthDialog";
import { 
  Brain, 
  FileText, 
  Video, 
  BarChart3, 
  Clock, 
  MessageSquare, 
  Target,
  Sparkles,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

const heroStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "64px 20px 48px",
  background: "linear-gradient(180deg,#fbfdff 0%, #f6f8fb 100%)"
};

const titleStyle: React.CSSProperties = {
  fontSize: 64,
  lineHeight: 1.02,
  margin: "8px 0 20px",
  color: "#2b6cb0",
  fontWeight: 800
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 20,
  color: "#6b7280",
  marginBottom: 28
};

const statStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 48,
  marginTop: 36,
  color: "#6b7280",
  fontWeight: 600
};

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Avatar",
      description: "Realistic virtual interviewer with emotions and natural speech for authentic practice sessions."
    },
    {
      icon: FileText,
      title: "Resume Analysis",
      description: "Upload your resume for AI-driven skill extraction and personalized role recommendations."
    },
    {
      icon: MessageSquare,
      title: "Dynamic Questions",
      description: "LLM-generated questions tailored to your role, experience, and resume content."
    },
    {
      icon: Video,
      title: "Video Recording",
      description: "Record your responses via webcam and mic for comprehensive evaluation and feedback."
    },
    {
      icon: Clock,
      title: "Timed Interviews",
      description: "Set custom time limits per question and total duration to simulate real interview pressure."
    },
    {
      icon: BarChart3,
      title: "Detailed Evaluation",
      description: "Get scored on communication, confidence, technical accuracy, and personality fit."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      description: "Share your resume for AI analysis and role matching"
    },
    {
      number: "02",
      title: "Select Role",
      description: "Choose your target role or let AI suggest the best fit"
    },
    {
      number: "03",
      title: "Set Parameters",
      description: "Configure interview duration and time per question"
    },
    {
      number: "04",
      title: "Interview Practice",
      description: "Face AI avatar with dynamic questions and real-time recording"
    },
    {
      number: "05",
      title: "Get Feedback",
      description: "Receive detailed scorecard with strengths and improvement areas"
    }
  ];

  const benefits = [
    "Unlimited practice sessions",
    "No scheduling conflicts",
    "Instant feedback",
    "Track improvement over time",
    "Build confidence",
    "Reduce interview anxiety"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "#e6f0ff", color: "#0b5fff", padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
            AI-Powered Interview Preparation
          </div>

          <h1 style={titleStyle}>Master Your Next Interview</h1>

          <p style={subtitleStyle}>
            Practice with our AI interviewer avatar, get instant feedback, and land your dream job with confidence
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
            <a href="/start" style={{ background: "#6b5ce6", color: "white", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
              Start Free Practice
            </a>
            <a href="/demo" style={{ background: "#fff", border: "1px solid rgba(16,24,40,0.06)", color: "#111827", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
              Watch Demo
            </a>
          </div>

          <div style={statStyle}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, color: "#6b5ce6", fontWeight: 800 }}>10K+</div>
              <div style={{ fontSize: 12 }}>Practice Sessions</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, color: "#2b6cb0", fontWeight: 800 }}>98%</div>
              <div style={{ fontSize: 12 }}>Success Rate</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, color: "#2b6cb0", fontWeight: 800 }}>50+</div>
              <div style={{ fontSize: 12 }}>Job Roles</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, color: "#6b5ce6", fontWeight: 800 }}>4.9/5</div>
              <div style={{ fontSize: 12 }}>User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              <Target className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines AI, ML, and LLM technologies for the most realistic interview experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              <TrendingUp className="h-3 w-3 mr-1" />
              Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple 5-step process
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-2 hover:border-secondary transition-colors">
                  <CardHeader>
                    <div className="text-6xl font-bold text-primary/20 mb-2">
                      {step.number}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="outline">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Benefits
              </Badge>
              <h2 className="text-4xl font-bold mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Practice makes perfect. Our AI-powered system helps you improve with every session.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="mt-8" onClick={() => setAuthOpen(true)}>
                Get Started Free
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-1">
                <div className="h-full w-full rounded-xl bg-background p-8 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Brain className="h-16 w-16 text-primary-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">AI-Powered</h3>
                      <p className="text-muted-foreground">
                        Advanced machine learning algorithms analyze your performance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of successful candidates who have improved their interview skills with our AI coach
              </p>
              <Button size="lg" className="text-lg px-12" onClick={() => setAuthOpen(true)}>
                Start Practicing Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 AI Interview Coach. All rights reserved.</p>
        </div>
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}