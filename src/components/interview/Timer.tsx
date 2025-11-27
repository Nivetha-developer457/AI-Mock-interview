"use client";

import { Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  label: string;
  variant?: "default" | "secondary";
}

export default function Timer({ timeRemaining, totalTime, label, variant = "default" }: TimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / totalTime) * 100;
    
    if (percentage > 50) return "text-green-500";
    if (percentage > 20) return "text-yellow-500";
    return "text-red-500";
  };

  const getTimeBgColor = () => {
    const percentage = (timeRemaining / totalTime) * 100;
    
    if (percentage > 50) return "bg-green-500/10 border-green-500/20";
    if (percentage > 20) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const isLowTime = (timeRemaining / totalTime) <= 0.2;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getTimeBgColor()}`}>
      {isLowTime ? (
        <AlertCircle className={`h-4 w-4 ${getTimeColor()} animate-pulse`} />
      ) : (
        <Clock className="h-4 w-4 text-muted-foreground" />
      )}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-lg font-bold font-mono ${getTimeColor()}`}>
          {formatTime(timeRemaining)}
        </p>
      </div>
    </div>
  );
}