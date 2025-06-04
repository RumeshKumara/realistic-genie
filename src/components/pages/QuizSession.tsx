import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

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
      const allQuestions = await generateMassiveQuestionSet();
      setQuestions(allQuestions);
      setLoading(false);
    } catch (error) {
      setError('Failed to load questions. Please try again.');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
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
    <div className="container mx-auto max-w-4xl p-4">
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
            <p className="text-muted-foreground mt-1">
              Answer carefully and thoroughly
            </p>
          </div>
          <div className="flex items-center gap-2 text-lg font-mono">
            <Clock className="h-5 w-5 text-primary" />
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
                    className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full h-40 p-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Type your answer here..."
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSubmitAnswer}
                className="flex items-center gap-2"
                disabled={!userAnswer.trim()}
              >
                Submit Answer
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Your Progress
            </h3>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
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