import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, MicOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface VoiceVerificationProps {
  onVerificationComplete: (success: boolean) => void;
}

const MAX_RETRIES = 3;
const RECORDING_TIME = 5000; // 5 seconds recording time

const VoiceVerification: React.FC<VoiceVerificationProps> = ({ onVerificationComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/wav'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await verifyVoice(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setVerificationStatus('idle');
      setError(null);
      
      // Start progress bar
      setRecordingProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setRecordingProgress(prev => {
          if (prev >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
            stopRecording();
            return 100;
          }
          return prev + (100 / (RECORDING_TIME / 100));
        });
      }, 100);

      // Auto stop after RECORDING_TIME
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, RECORDING_TIME);

    } catch (err) {
      setError('Failed to access microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setVerificationStatus('verifying');
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const verifyVoice = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/verify-voice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setVerificationStatus('success');
        onVerificationComplete(true);
      } else {
        setVerificationStatus('failed');
        setRetryCount(prev => prev + 1);
        if (retryCount + 1 >= MAX_RETRIES) {
          setError('Maximum retry attempts reached. Please contact support.');
          onVerificationComplete(false);
        } else {
          setError(`Voice verification failed. ${MAX_RETRIES - (retryCount + 1)} attempts remaining.`);
          onVerificationComplete(false);
        }
      }
    } catch (err) {
      setVerificationStatus('failed');
      setIsNetworkError(true);
      setError('Network error. Please check your connection and try again.');
      onVerificationComplete(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      startRecording();
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Voice Verification</h2>
        <p className="text-center text-gray-600">
          Please say "I love my university" to verify your identity
        </p>

        {isRecording && (
          <div className="space-y-2">
            <Progress value={recordingProgress} className="w-full" />
            <p className="text-center text-sm text-gray-500">
              Recording... {Math.round(recordingProgress)}%
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            className="w-32"
            disabled={retryCount >= MAX_RETRIES}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Record
              </>
            )}
          </Button>
        </div>

        {verificationStatus === 'verifying' && (
          <Alert>
            <AlertDescription>Verifying your voice...</AlertDescription>
          </Alert>
        )}

        {verificationStatus === 'success' && (
          <Alert className="bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Voice verification successful!
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === 'failed' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === 'failed' && retryCount < MAX_RETRIES && (
          <div className="flex justify-center">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {retryCount >= MAX_RETRIES && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Maximum retry attempts reached. Please contact support.
            </AlertDescription>
          </Alert>
        )}

        {isNetworkError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to connect to the verification service. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};

export default VoiceVerification; 