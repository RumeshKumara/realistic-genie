import { useState } from 'react';
import { Plus, Calendar, Clock, ArrowRight, Search, Filter, BarChart2, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import NewInterviewModal from '../features/NewInterviewModal';

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

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [interviews, setInterviews] = useState<Array<{
    id: string;
    title: string;
    jobRole: string;
    createdAt: Date;
    lastUpdated: Date | null;
    score?: number;
    status: 'completed' | 'scheduled' | 'in-progress';
  }>>([
    {
      id: '1',
      title: 'Frontend Developer Interview',
      jobRole: 'Senior React Developer',
      createdAt: new Date('2024-03-10'),
      lastUpdated: new Date('2024-03-15'),
      score: 85,
      status: 'completed'
    },
    {
      id: '2',
      title: 'System Design Interview',
      jobRole: 'Software Architect',
      createdAt: new Date('2024-03-12'),
      lastUpdated: null,
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Behavioral Interview',
      jobRole: 'Product Manager',
      createdAt: new Date('2024-03-14'),
      lastUpdated: new Date('2024-03-14'),
      score: 92,
      status: 'completed'
    }
  ]);

  const handleCreateInterview = (interviewData: {
    title: string;
    jobRole: string;
    description?: string;
  }) => {
    const newInterview = {
      id: crypto.randomUUID(),
      title: interviewData.title,
      jobRole: interviewData.jobRole,
      createdAt: new Date(),
      lastUpdated: null,
      status: 'scheduled' as const
    };
    
    setInterviews([newInterview, ...interviews]);
    setIsModalOpen(false);
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interview.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalInterviews: interviews.length,
    completedInterviews: interviews.filter(i => i.status === 'completed').length,
    averageScore: Math.round(
      interviews
        .filter(i => i.score)
        .reduce((acc, curr) => acc + (curr.score || 0), 0) /
        interviews.filter(i => i.score).length
    ),
    streak: 5
  };

  return (
    <motion.div 
      className="p-6 space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Create and practice AI-powered mock interviews</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="flex items-center gap-2 group"
        >
          <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
          New Interview
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-4"
        variants={container}
      >
        <motion.div variants={item}>
          <Card className="p-6 card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BarChart2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
                <h4 className="text-2xl font-bold">{stats.totalInterviews}</h4>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="p-6 card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <h4 className="text-2xl font-bold">{stats.completedInterviews}</h4>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="p-6 card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <h4 className="text-2xl font-bold">{stats.averageScore}%</h4>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="p-6 card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-500/10">
                <Award className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <h4 className="text-2xl font-bold">{stats.streak} days</h4>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div variants={item} className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search interviews..."
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

      {/* Interview Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
      >
        {/* Add New Interview Card */}
        <motion.div variants={item}>
          <Card 
            className="group flex flex-col items-center justify-center min-h-[280px] p-8 cursor-pointer bg-gradient-to-br from-primary/5 to-purple-500/5 hover:from-primary/10 hover:to-purple-500/10 border-dashed border-2 transition-all duration-500 card-hover-effect"
          >
            <div 
              className="flex flex-col items-center justify-center w-full h-full gap-6 text-center"
              onClick={() => setIsModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true); }}
            >
              <div className="p-4 transition-transform duration-300 rounded-full bg-primary/10 text-primary group-hover:scale-110">
                <Plus size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-primary">Create New Interview</h3>
                <p className="text-muted-foreground">Start practicing with AI-powered interviews</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Interview cards */}
        {filteredInterviews.map((interview) => (
          <motion.div key={interview.id} variants={item}>
            <Card className="p-6 space-y-4 card-hover-effect">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold line-clamp-1">{interview.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    interview.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                    interview.status === 'scheduled' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{interview.jobRole}</p>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Created: {interview.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Duration: ~45 mins</span>
                </div>
                {interview.score && (
                  <div className="flex items-center gap-2">
                    <Target size={16} />
                    <span>Score: {interview.score}%</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full group button-hover-effect"
                  size="lg"
                >
                  {interview.status === 'completed' ? 'View Results' : 'Start Interview'}
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* New Interview Modal */}
      <NewInterviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateInterview}
      />
    </motion.div>
  );
}