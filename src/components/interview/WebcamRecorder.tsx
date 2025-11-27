"use client";

import { useEffect, useRef, useState } from "react";
import { Video, VideoOff, Loader2 } from "lucide-react";

interface WebcamRecorderProps {
  isRecording: boolean;
  isPaused: boolean;
}

export default function WebcamRecorder({ isRecording, isPaused }: WebcamRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      if (isPaused) {
        stream.getVideoTracks().forEach(track => track.enabled = false);
      } else {
        stream.getVideoTracks().forEach(track => track.enabled = true);
      }
    }
  }, [isPaused, stream]);

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: true
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setLoading(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Initializing camera...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
        <div className="text-center p-6">
          <VideoOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm font-medium mb-2">Camera Unavailable</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Recording indicator */}
        {isRecording && !isPaused && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            REC
          </div>
        )}

        {/* Paused overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-white text-center">
              <Video className="h-12 w-12 mx-auto mb-2" />
              <p className="font-medium">Recording Paused</p>
            </div>
          </div>
        )}

        {/* Corner overlays for professional look */}
        <div className="absolute top-0 left-0 h-12 w-12 border-t-2 border-l-2 border-primary/50" />
        <div className="absolute top-0 right-0 h-12 w-12 border-t-2 border-r-2 border-primary/50" />
        <div className="absolute bottom-0 left-0 h-12 w-12 border-b-2 border-l-2 border-primary/50" />
        <div className="absolute bottom-0 right-0 h-12 w-12 border-b-2 border-r-2 border-primary/50" />
      </div>

      {/* Info bar */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Your Response</span>
        {isRecording && (
          <span className="text-green-500 font-medium">● Recording</span>
        )}
      </div>
    </div>
  );
}