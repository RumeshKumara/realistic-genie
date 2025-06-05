import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Clock, Award, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { generateMassiveQuestionSet, evaluateAnswer } from '../../lib/gemini';

interface Question {
  question: string;
  expectedAnswer: string;
  keyPoints: string[];
  scoringCriteria: {
    max: number;
    criteria: string[];
  };
}

interface Answer {
  questionIndex: number;
  userAnswer: string;
  evaluation: {
    score: number;
    feedback: string;
    improvements: string[];
  };
}

export default function QuizSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    if (location.state?.questions) {
      setQuestions(location.state.questions);
      setLoading(false);
    } else {
      loadQuestions();
    }
  }, [location]);

  useEffect(() => {
    if (timeLeft > 0 && !quizComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !quizComplete) {
      handleSubmitAnswer();
    }
  }, [timeLeft, quizComplete]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get questions from localStorage first
      const savedQuestions = localStorage.getItem('currentQuestions');
      if (savedQuestions) {
        const parsed = JSON.parse(savedQuestions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          setLoading(false);
          return;
        }
      }

      // Fallback to generating new questions
      const allQuestions = await generateMassiveQuestionSet();
      if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
        throw new Error('No questions generated');
      }
      
      setQuestions(allQuestions);
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to load questions:', error);
      setError(error.message || 'Failed to load questions. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      const evaluation = await evaluateAnswer(
        currentQuestion.question,
        userAnswer,
        'Software Developer',
        '3-5 years'
      );

      const newAnswer: Answer = {
        questionIndex: currentQuestionIndex,
        userAnswer,
        evaluation
      };

      setAnswers(prev => [...prev, newAnswer]);
      setUserAnswer('');

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(300); // Reset timer for next question
      } else {
        setQuizComplete(true);
        navigate('/quiz-results', { 
          state: { 
            questions,
            answers: [...answers, newAnswer]
          }
        });
      }
    } catch (error) {
      setError('Failed to evaluate answer. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="mt-4 text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md p-6">
          <div className="space-y-4 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
            <h2 className="text-xl font-semibold">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={loadQuestions}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container max-w-4xl p-4 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Answer carefully and thoroughly
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-lg">
            <Clock className="w-5 h-5 text-primary" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {questions[currentQuestionIndex]?.question}
              </h2>
              <div className="flex flex-wrap gap-2">
                {questions[currentQuestionIndex]?.keyPoints.map((point, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full h-40 p-4 transition-all border rounded-lg border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Type your answer here..."
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSubmitAnswer}
                className="flex items-center gap-2"
                disabled={!userAnswer.trim()}
              >
                Submit Answer
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Award className="w-5 h-5 text-primary" />
              Your Progress
            </h3>
            <div className="relative h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-300 rounded-full bg-primary"
                style={{
                  width: `${(answers.length / questions.length) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{answers.length} answered</span>
              <span>{questions.length - answers.length} remaining</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}