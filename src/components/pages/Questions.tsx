import { useState } from 'react';
import { Search, Filter, BookOpen, Code, Users, Brain, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Button from '../ui/Button';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

type QuestionCategory = 'all' | 'technical' | 'behavioral' | 'system-design';

interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  description: string;
  timesAsked: number;
  successRate: number;
}

export default function Questions() {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const questions: Question[] = [
    {
      id: '1',
      category: 'technical',
      difficulty: 'medium',
      question: 'Explain the concept of closures in JavaScript',
      description: 'Focus on scope, lexical environment, and practical use cases',
      timesAsked: 1250,
      successRate: 75
    },
    {
      id: '2',
      category: 'behavioral',
      difficulty: 'medium',
      question: 'Tell me about a time you handled a difficult team situation',
      description: 'Use the STAR method to structure your response',
      timesAsked: 980,
      successRate: 82
    },
    {
      id: '3',
      category: 'system-design',
      difficulty: 'hard',
      question: 'Design a real-time chat application',
      description: 'Consider scalability, message delivery, and offline support',
      timesAsked: 750,
      successRate: 68
    },
    {
      id: '4',
      category: 'technical',
      difficulty: 'easy',
      question: 'What is the difference between let, const, and var?',
      description: 'Explain scope, hoisting, and best practices',
      timesAsked: 1500,
      successRate: 88
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: BookOpen },
    { id: 'technical', name: 'Technical', icon: Code },
    { id: 'behavioral', name: 'Behavioral', icon: Users },
    { id: 'system-design', name: 'System Design', icon: Brain }
  ];

  const filteredQuestions = questions.filter(q => 
    (selectedCategory === 'all' || q.category === selectedCategory) &&
    (q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     q.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-orange-500 bg-orange-500/10';
      case 'hard': return 'text-red-500 bg-red-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item}>
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
          Question Bank
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse and practice common interview questions
        </p>
      </motion.div>

      {/* Categories */}
      <motion.div variants={item} className="flex flex-wrap gap-4">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => setSelectedCategory(category.id as QuestionCategory)}
            >
              <Icon size={16} />
              {category.name}
            </Button>
          );
        })}
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 transition-all border rounded-lg border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filter
        </Button>
      </motion.div>

      {/* Questions Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-4"
        variants={container}
      >
        {filteredQuestions.map((question) => (
          <motion.div key={question.id} variants={item}>
            <Card className="card-hover-effect">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{question.question}</CardTitle>
                    <CardDescription>{question.description}</CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-muted-foreground" />
                    <span>Asked {question.timesAsked} times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-muted-foreground" />
                    <span>{question.successRate}% success rate</span>
                  </div>
                  <Button className="ml-auto">Practice Now</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}