import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronRight, Download, Share2 } from 'lucide-react';
import Confetti from 'react-confetti';
import { Card } from '../ui/Card';
import Button from '../ui/Button';

interface Answer {
  answer: string;
  evaluation: {
    score: number;
    feedback: string;
    improvements: string[];
  };
}

export default function InterviewResults() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const answersData = localStorage.getItem('interviewAnswers');
    const questionsData = localStorage.getItem('interviewQuestions');
    
    if (!answersData || !questionsData) {
      navigate('/');
      return;
    }

    setAnswers(JSON.parse(answersData));
    setQuestions(JSON.parse(questionsData));
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const overallScore = Math.round(
    Object.values(answers).reduce((acc, answer) => acc + answer.evaluation.score, 0) / 
    Object.keys(answers).length
  );

  const feedback = [
    {
      category: "Technical Knowledge",
      score: Math.round(
        Object.values(answers).reduce((acc, answer) => acc + answer.evaluation.score, 0) / 
        Object.keys(answers).length
      ),
      feedback: "Overall technical understanding demonstrated",
      improvements: Array.from(
        new Set(
          Object.values(answers)
            .flatMap(answer => answer.evaluation.improvements)
            .slice(0, 2)
        )
      )
    },
    {
      category: "Communication",
      score: Math.round(
        Object.values(answers).reduce((acc, answer) => acc + answer.evaluation.score, 0) / 
        Object.keys(answers).length
      ),
      feedback: "Clear and structured responses provided",
      improvements: [
        "Use more specific examples",
        "Reduce filler words"
      ]
    },
    {
      category: "Problem Solving",
      score: Math.round(
        Object.values(answers).reduce((acc, answer) => acc + answer.evaluation.score, 0) / 
        Object.keys(answers).length
      ),
      feedback: "Good approach to problem-solving demonstrated",
      improvements: [
        "Explain thought process more clearly",
        "Consider edge cases"
      ]
    }
  ];

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <div className="container mx-auto max-w-4xl p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block"
            >
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <Award className="h-12 w-12" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Interview Complete!
            </h1>
            <p className="text-xl text-muted-foreground">
              Here's how you performed in your interview
            </p>
          </div>

          {/* Overall Score */}
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Overall Performance</h2>
              <div className="text-6xl font-bold text-primary">{overallScore}%</div>
              <p className="text-muted-foreground">
                {overallScore >= 80 ? 'Excellent job!' : 
                 overallScore >= 60 ? 'Good effort!' : 
                 'Keep practicing!'}
              </p>
            </div>
          </Card>

          {/* Question Review */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Question Review</h2>
            {questions.map((question, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                    <span className="text-2xl font-bold text-primary">
                      {answers[index]?.evaluation.score}%
                    </span>
                  </div>
                  <p className="text-muted-foreground">{question.question}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Feedback</h4>
                    <p className="text-muted-foreground">{answers[index]?.evaluation.feedback}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Areas to Improve</h4>
                    <ul className="space-y-1">
                      {answers[index]?.evaluation.improvements.map((improvement, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                const data = {
                  questions,
                  answers,
                  overallScore,
                  feedback
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'interview-results.json';
                a.click();
              }}
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(
                  `I just completed an AI interview and scored ${overallScore}%! 🎉`
                );
              }}
            >
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Button
              onClick={() => navigate('/')}
            >
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}