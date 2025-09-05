import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Video, Square, Play, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InterviewState {
  isStarted: boolean;
  isRecording: boolean;
  isLoading: boolean;
  currentQuestion: string;
  lastTranscript: string;
}

const Interview = () => {
  const [state, setState] = useState<InterviewState>({
    isStarted: false,
    isRecording: false,
    isLoading: false,
    currentQuestion: "",
    lastTranscript: ""
  });

  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startInterview = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch("/start_interview", { method: "POST" });
      const blob = await response.blob();
      
      const audio = new Audio(URL.createObjectURL(blob));
      await audio.play();
      
      setState(prev => ({
        ...prev,
        isStarted: true,
        isLoading: false,
        currentQuestion: "Welcome to your interview! Please introduce yourself."
      }));
      
      toast({
        title: "Interview Started",
        description: "Listen to the first question and click Start Recording when ready."
      });
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start interview. Please try again."
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      // Create separate recorders for audio and video
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      videoChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Store both audio and video data
          audioChunksRef.current.push(event.data);
          videoChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setState(prev => ({ ...prev, isRecording: true }));
      
      toast({
        title: "Recording Started",
        description: "Speak clearly and answer the question."
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to access camera/microphone."
      });
    }
  };

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;
    
    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        try {
          setState(prev => ({ ...prev, isRecording: false, isLoading: true }));
          
          // Create audio blob (WAV format)
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          
          // Create video blob (MP4 format)
          const videoBlob = new Blob(videoChunksRef.current, { type: 'video/mp4' });
          
          // Stop all tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          
          // Submit answer to backend
          const formData = new FormData();
          formData.append("audio", audioBlob, "answer.wav");
          formData.append("video", videoBlob, "answer.mp4");
          
          const response = await fetch("/submit_answer", {
            method: "POST",
            body: formData
          });
          
          if (response.ok) {
            const nextQuestionBlob = await response.blob();
            
            // Play next question
            const audio = new Audio(URL.createObjectURL(nextQuestionBlob));
            await audio.play();
            
            // Check if interview is finished
            const audioText = await audio.src; // This would need actual transcription
            if (audioText.includes("Interview finished")) {
              setState(prev => ({
                ...prev,
                isLoading: false,
                currentQuestion: "Interview completed! Thank you.",
                lastTranscript: "Interview session completed successfully."
              }));
              
              toast({
                title: "Interview Complete",
                description: "You can now view your results."
              });
            } else {
              setState(prev => ({
                ...prev,
                isLoading: false,
                currentQuestion: "Next question is playing...",
                lastTranscript: "Answer submitted successfully. Listen for the next question."
              }));
            }
          } else {
            throw new Error("Failed to submit answer");
          }
        } catch (error) {
          console.error("Error submitting answer:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to submit answer. Please try again."
          });
          setState(prev => ({ ...prev, isLoading: false, isRecording: false }));
        }
        
        resolve();
      };
      
      mediaRecorderRef.current!.stop();
    });
  }, [toast]);

  const submitAnswer = async () => {
    await stopRecording();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            AI Interview Platform
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete your interview with confidence
          </p>
        </motion.div>

        {/* Main Interview Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video/Recording Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-card border-primary/20">
              <h2 className="text-2xl font-semibold mb-4 text-center">Recording Area</h2>
              
              <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                {state.isRecording ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-4 border-primary rounded-lg"
                  />
                ) : null}
                
                <div className="flex flex-col items-center justify-center text-center p-8">
                  {state.isRecording ? (
                    <>
                      <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                        <Video className="h-8 w-8 text-destructive-foreground" />
                      </div>
                      <p className="text-lg font-medium">Recording in progress...</p>
                      <p className="text-muted-foreground">Speak clearly and maintain eye contact</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-muted-foreground rounded-full flex items-center justify-center mb-4">
                        <Video className="h-8 w-8 text-background" />
                      </div>
                      <p className="text-lg font-medium">Camera Preview</p>
                      <p className="text-muted-foreground">Start recording to begin</p>
                    </>
                  )}
                </div>
              </div>

              {/* Recording Controls */}
              <div className="flex flex-col gap-4">
                {!state.isStarted ? (
                  <Button
                    onClick={startInterview}
                    disabled={state.isLoading}
                    size="lg"
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
                  >
                    {state.isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Play className="h-5 w-5 mr-2" />
                    )}
                    Start Interview
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    {!state.isRecording ? (
                      <Button
                        onClick={startRecording}
                        disabled={state.isLoading}
                        size="lg"
                        className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                      >
                        <Mic className="h-5 w-5 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        onClick={submitAnswer}
                        disabled={state.isLoading}
                        size="lg"
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {state.isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                          <Square className="h-5 w-5 mr-2" />
                        )}
                        Submit Answer
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Transcript Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 h-full bg-gradient-card border-interview-accent/20">
              <h2 className="text-2xl font-semibold mb-4">Interview Progress</h2>
              
              {/* Current Question */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-interview-accent">Current Question:</h3>
                <div className="p-4 bg-muted rounded-lg">
                  {state.currentQuestion || "Click 'Start Interview' to begin..."}
                </div>
              </div>

              {/* Last Transcript */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-success">Your Last Response:</h3>
                <div className="p-4 bg-muted rounded-lg min-h-[100px]">
                  {state.lastTranscript || "Your response will appear here after answering..."}
                </div>
              </div>

              {/* Status */}
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="font-medium mb-2">Status</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    state.isRecording ? 'bg-destructive animate-pulse' :
                    state.isStarted ? 'bg-success' : 'bg-muted-foreground'
                  }`} />
                  <span className="text-sm">
                    {state.isRecording ? 'Recording' :
                     state.isStarted ? 'Ready' : 'Not Started'}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button
            variant="outline"
            onClick={() => window.location.href = "/results"}
            className="border-primary/50 hover:bg-primary/10"
          >
            View Results
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Interview;