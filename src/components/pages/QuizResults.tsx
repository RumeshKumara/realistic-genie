import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Confetti from 'react-confetti';

export default function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers } = location.state || {};

  useEffect(() => {
    if (!questions || !answers) {
      navigate('/');
    }
  }, [questions, answers, navigate]);

  if (!questions || !answers) return null;

  const overallScore = Math.round(
    answers.reduce((acc, answer) => acc + answer.evaluation.score, 0) / answers.length
  );

  const downloadResults = () => {
    const data = {
      totalQuestions: questions.length,
      answeredQuestions: answers.length,
      overallScore,
      answers: answers.map((answer, index) => ({
        question: questions[answer.questionIndex].question,
        userAnswer: answer.userAnswer,
        expectedAnswer: questions[answer.questionIndex].expectedAnswer,
        score: answer.evaluation.score,
        feedback: answer.evaluation.feedback,
        improvements: answer.evaluation.improvements
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.json';
    a.click();
  };

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
      />
      <div className="container mx-auto max-w-4xl p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
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
              Quiz Complete!
            </h1>
            <p className="text-xl text-muted-foreground">
              You've completed all {questions.length} questions
            </p>
          </div>

          <Card className="p-8 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Overall Score</h2>
              <div className="text-6xl font-bold text-primary">{overallScore}%</div>
              <p className="text-muted-foreground">
                {overallScore >= 80 ? 'Outstanding performance!' : 
                 overallScore >= 60 ? 'Good effort!' : 
                 'Keep practicing!'}
              </p>
            </div>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Detailed Results</h2>
            {answers.map((answer, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Question {answer.questionIndex + 1}</h3>
                    <span className="text-2xl font-bold text-primary">
                      {answer.evaluation.score}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">{questions[answer.questionIndex].question}</p>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-muted-foreground">{answer.userAnswer}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Expected Answer</h4>
                    <p className="text-muted-foreground">
                      {questions[answer.questionIndex].expectedAnswer}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Feedback</h4>
                    <p className="text-muted-foreground">{answer.evaluation.feedback}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Areas to Improve</h4>
                    <ul className="space-y-1">
                      {answer.evaluation.improvements.map((improvement, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 text-green-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Strong points</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-500">
                      <ThumbsDown className="h-4 w-4" />
                      <span>Areas for improvement</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={downloadResults}
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(
                  `I just completed a massive quiz and scored ${overallScore}%! 🎉`
                );
              }}
            >
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Button onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}