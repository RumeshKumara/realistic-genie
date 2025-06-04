import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, MessageSquare, Mic, Video, AlertCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { evaluateAnswer } from '../../lib/gemini';

interface Question {
  question: string;
  expectedAnswer: string;
  keyPoints: string[];
  scoringCriteria: {
    max: number;
    criteria: string[];
  };
}

export default function InterviewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, interviewData } = location.state || {};
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question
  const [isAnswering, setIsAnswering] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { answer: string; evaluation: any }>>({});
  const [notes, setNotes] = useState('');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  useEffect(() => {
    if (!questions || !interviewData) {
      navigate('/');
      return;
    }
  }, [questions, interviewData, navigate]);

  useEffect(() => {
    if (isAnswering && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isAnswering) {
      handleStopRecording();
    }
  }, [timeLeft, isAnswering]);

  const handleStartRecording = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (webcamRef.current) {
        webcamRef.current.video!.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };

      mediaRecorderRef.current.start();
      setIsAnswering(true);
      setTimeLeft(180);
    } catch (error) {
      console.error('Error starting recording:', error);
      setPermissionError('Failed to start recording. Please check your device permissions.');
    }
  };

  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    setIsAnswering(false);

    try {
      const evaluation = await evaluateAnswer(
        questions[currentQuestionIndex].question,
        notes,
        interviewData.jobRole,
        interviewData.yearsOfExperience
      );

      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: { answer: notes, evaluation }
      }));
    } catch (error) {
      console.error('Error evaluating answer:', error);
      setPermissionError('Failed to evaluate answer. Please try again.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setNotes('');
      setTimeLeft(180);
    } else {
      // Save interview data and navigate to results
      localStorage.setItem('interviewAnswers', JSON.stringify(answers));
      localStorage.setItem('interviewQuestions', JSON.stringify(questions));
      navigate('/interview/results');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions || !interviewData) return null;

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column - Video Feed and Question */}
        <div className="space-y-6">
          <Card className="p-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              <Webcam
                ref={webcamRef}
                audio={true}
                className="w-full h-full object-cover"
                mirrored
              />
              {permissionError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 text-center">
                  <div className="space-y-4">
                    <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
                    <p>{permissionError}</p>
                  </div>
                </div>
              )}
              {isAnswering && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Recording
                </div>
              )}
            </div>
          </Card>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-primary">
                      Question {currentQuestionIndex + 1}
                    </span>
                    <span className="text-muted-foreground">
                      of {questions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-mono">
                    <Clock className="h-5 w-5 text-primary" />
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <p className="text-lg mb-6">{questions[currentQuestionIndex].question}</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    Notes
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-32 p-4 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Take notes during your answer..."
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  {!isAnswering ? (
                    <Button
                      onClick={handleStartRecording}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStopRecording}
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}
                  <Button
                    onClick={handleNextQuestion}
                    className="flex-1"
                    disabled={!answers[currentQuestionIndex] || isAnswering}
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column - Question Progress */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Question Progress</h2>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    index === currentQuestionIndex
                      ? 'border-primary bg-primary/5'
                      : index < currentQuestionIndex
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-border opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === currentQuestionIndex
                        ? 'bg-primary text-white'
                        : index < currentQuestionIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${
                        index === currentQuestionIndex
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}>
                        {question.question}
                      </p>
                      {answers[index] && (
                        <div className="mt-2 text-sm text-green-500">
                          Score: {answers[index].evaluation.score}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}