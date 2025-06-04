import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Video, Mic, Settings, AlertCircle, ArrowLeft, } from 'lucide-react';
import Webcam from 'react-webcam';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { generateQuestions } from '../../lib/gemini';

interface Question {
  question: string;
  expectedAnswer: string;
  keyPoints: string[];
  scoringCriteria: {
    max: number;
    criteria: string[];
  };
}

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [hasWebcam, setHasWebcam] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [webcamSettings, setWebcamSettings] = useState({
    width: 1280,
    height: 720,
    facingMode: "user"
  });
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'setup' | 'interview' | 'results'>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const webcamRef = useRef<Webcam | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('interviewData');
    if (data) {
      setInterviewData(JSON.parse(data));
    }
  }, []);

  const handleDeviceCheck = async () => {
    try {
      setPermissionError(null);
      const constraints = {
        video: webcamEnabled ? webcamSettings : false,
        audio: micEnabled
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setHasWebcam(webcamEnabled);
      setHasMic(micEnabled);
      setIsReady(webcamEnabled || micEnabled);
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      console.error('Media device error:', error);
      setHasWebcam(false);
      setHasMic(false);
      setIsReady(false);
      
      if (error.name === 'NotAllowedError') {
        setPermissionError('Device access was denied. Please enable permissions in your browser settings and try again.');
      } else if (error.name === 'NotFoundError') {
        setPermissionError('Required devices not found. Please check your connections.');
      } else {
        setPermissionError('An error occurred while accessing your devices. Please check your connections and try again.');
      }
    }
  };

  const startInterview = async () => {
    try {
      setIsLoading(true);
      const generatedQuestions = await generateQuestions(
        interviewData.jobRole,
        5, // number of questions
        interviewData.yearsOfExperience
      );
      
      setQuestions(generatedQuestions);
      navigate('/interview/session', { 
        state: { 
          questions: generatedQuestions,
          interviewData 
        }
      });
    } catch (error) {
      console.error('Failed to start interview:', error);
      setPermissionError('Failed to generate interview questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!interviewData) return null;

  return (
    <div className="container max-w-6xl p-4 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
              Interview Setup
            </h1>
            <p className="mt-2 text-muted-foreground">
              Let's make sure everything is ready for your {interviewData.jobRole} interview
            </p>
          </div>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Camera Preview</h2>
              <div className="relative overflow-hidden rounded-lg aspect-video bg-black/10">
                {hasWebcam ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="object-cover w-full h-full"
                    mirrored
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Device Settings</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Video className={hasWebcam ? 'text-green-500' : 'text-red-500'} />
                      <span>Camera: {hasWebcam ? 'Ready' : 'Not detected'}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWebcamEnabled(!webcamEnabled)}
                      className={`${webcamEnabled ? 'bg-primary/10' : ''}`}
                    >
                      {webcamEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Mic className={hasMic ? 'text-green-500' : 'text-red-500'} />
                      <span>Microphone: {hasMic ? 'Ready' : 'Not detected'}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMicEnabled(!micEnabled)}
                      className={`${micEnabled ? 'bg-primary/10' : ''}`}
                    >
                      {micEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleDeviceCheck}
                  variant="outline"
                  className="flex items-center justify-center w-full gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Check Devices
                </Button>
                <Button
                  onClick={startInterview}
                  className="w-full"
                  disabled={!isReady || isLoading}
                >
                  {isLoading ? 'Preparing Interview...' : 'Start Interview'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}