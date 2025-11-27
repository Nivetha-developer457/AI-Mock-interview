"use client";

import { useEffect, useState } from "react";
import { Smile, Sparkles, ThumbsUp, User } from "lucide-react";

interface AvatarDisplayProps {
  emotion: "neutral" | "smile" | "thinking" | "nodding";
}

export default function AvatarDisplay({ emotion }: AvatarDisplayProps) {
  const [currentEmotion, setCurrentEmotion] = useState(emotion);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    setCurrentEmotion(emotion);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [emotion]);

  const getEmotionIcon = () => {
    switch (currentEmotion) {
      case "smile":
        return <Smile className="h-24 w-24 text-primary" />;
      case "thinking":
        return <Sparkles className="h-24 w-24 text-secondary" />;
      case "nodding":
        return <ThumbsUp className="h-24 w-24 text-accent" />;
      default:
        return <User className="h-24 w-24 text-muted-foreground" />;
    }
  };

  const getEmotionLabel = () => {
    switch (currentEmotion) {
      case "smile":
        return "Ready to listen";
      case "thinking":
        return "Preparing question...";
      case "nodding":
        return "Listening attentively";
      default:
        return "AI Interviewer";
    }
  };

  const getBackgroundGradient = () => {
    switch (currentEmotion) {
      case "smile":
        return "from-primary/20 via-primary/10 to-transparent";
      case "thinking":
        return "from-secondary/20 via-secondary/10 to-transparent";
      case "nodding":
        return "from-accent/20 via-accent/10 to-transparent";
      default:
        return "from-muted/20 via-muted/10 to-transparent";
    }
  };

  return (
    <div className="relative">
      <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-background to-muted flex items-center justify-center relative">
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()} ${isAnimating ? 'animate-pulse' : ''}`} />
        
        {/* Avatar circle */}
        <div className={`relative z-10 h-48 w-48 rounded-full bg-gradient-to-br ${getBackgroundGradient()} flex items-center justify-center transition-transform duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
          <div className="h-40 w-40 rounded-full bg-background flex items-center justify-center">
            {getEmotionIcon()}
          </div>
        </div>

        {/* Animated rings */}
        {currentEmotion === "nodding" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-56 w-56 rounded-full border-2 border-accent/30 animate-ping" />
            <div className="absolute h-64 w-64 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDelay: '0.3s' }} />
          </div>
        )}

        {/* Particles for thinking */}
        {currentEmotion === "thinking" && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-secondary animate-bounce" />
            <div className="absolute top-1/3 right-1/3 h-2 w-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-1/3 left-1/3 h-2 w-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
      </div>

      {/* Label */}
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold">{getEmotionLabel()}</p>
        <p className="text-sm text-muted-foreground mt-1">
          AI Interviewer is {currentEmotion === "nodding" ? "recording your response" : currentEmotion === "thinking" ? "generating questions" : "ready"}
        </p>
      </div>
    </div>
  );
}