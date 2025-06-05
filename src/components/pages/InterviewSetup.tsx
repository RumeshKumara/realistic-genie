import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Video, Mic, Settings, AlertCircle, ArrowLeft, } from 'lucide-react';
import Webcam from 'react-webcam';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { generateInterviewQuestions } from '../../lib/interview';

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
      setPermissionError(null);

      if (!interviewData?.jobRole || !interviewData?.yearsOfExperience) {
        throw new Error('Please fill in all interview details');
      }

      console.log('Interview Data:', {
        role: interviewData.jobRole,
        experience: interviewData.yearsOfExperience
      });

      // Extract the numeric value and convert to string
      const experienceLevel = String(parseInt(interviewData.yearsOfExperience));
      
      console.log('Parsed experience level:', experienceLevel);

      const generatedQuestions = await generateInterviewQuestions(
        interviewData.jobRole,
        5, // number of questions
        experienceLevel
      );

      console.log('Generated Questions:', generatedQuestions);

      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error('No questions were generated. Please try again.');
      }

      // Store in localStorage as backup
      localStorage.setItem('currentQuestions', JSON.stringify(generatedQuestions));
      
      navigate('/quiz-session', { 
        state: { 
          questions: generatedQuestions,
          interviewData 
        },
        replace: true
      });
    } catch (error: any) {
      console.error('Interview generation error:', error);
      setPermissionError(
        error.message || 'Failed to generate interview questions. Please try again.'
      );
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Camera Preview - Left Side */}
          <Card className="order-2 p-6 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Camera Preview</h2>
              <div className="relative overflow-hidden rounded-lg aspect-video border-r border-t border-l-2 border-b-2 border-purple-500 bg-[#f6f0ff] dark:bg-[#0d0d0e]">
                {hasWebcam ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="object-cover w-full h-full"
                    mirrored
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-[#a751f8]" />
                  </div>
                )}
              </div>

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
                {permissionError && (
                  <div className="p-3 text-sm text-red-500 rounded-md bg-red-50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {permissionError}
                    </div>
                  </div>
                )}
                <Button
                  onClick={startInterview}
                  className="w-full"
                  disabled={!isReady || isLoading}
                >
                  {isLoading ? 'Preparing Interview...' : 'Start Interview'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Interview Details - Right Side */}
          <Card className="order-1 p-6 lg:order-1">
            <div className="space-y-4">
              <h2 className="mb-4 text-xl font-semibold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
                Interview Details
              </h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/5">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Title:</span>
                      <p className="text-lg font-semibold">{interviewData?.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Job Role:</span>
                      <p className="text-lg font-semibold text-primary">{interviewData?.jobRole}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Experience Level:</span>
                      <p className="text-lg font-semibold">{interviewData?.yearsOfExperience}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Interview Purpose:</span>
                      <p className="text-lg font-semibold">
                        {interviewData?.reasonForInterview === 'new-job' && 'Looking for a new job'}
                        {interviewData?.reasonForInterview === 'practice' && 'General practice'}
                        {interviewData?.reasonForInterview === 'upcoming' && 'Preparing for upcoming interview'}
                        {interviewData?.reasonForInterview === 'skills' && 'Improving interview skills'}
                        {interviewData?.reasonForInterview === 'career-switch' && 'Switching career paths'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-primary/5">
                  <h3 className="mb-2 text-sm font-medium">What to expect:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 5 technical questions based on your experience level</li>
                    <li>• Real-time feedback on your responses</li>
                    <li>• Performance analysis after completion</li>
                    <li>• Suggestions for improvement</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}