import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Clock, Target, Settings } from 'lucide-react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';

interface InterviewFormData {
  jobRole: string;
  duration: number;
  questionCount: number;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  focusAreas: string[];
}

export default function InterviewForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InterviewFormData>({
    jobRole: '',
    duration: 30,
    questionCount: 5,
    difficulty: 'intermediate',
    focusAreas: []
  });

  const focusAreaOptions = [
    'Technical Skills',
    'Problem Solving',
    'System Design',
    'Behavioral',
    'Leadership',
    'Communication'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Store interview settings in localStorage
    localStorage.setItem('interviewSettings', JSON.stringify(formData));
    navigate('/interview/setup');
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Briefcase className="h-4 w-4 text-primary" />
            Job Role
          </label>
          <input
            type="text"
            value={formData.jobRole}
            onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
            placeholder="e.g., Senior React Developer"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              min={15}
              max={60}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4 text-primary" />
              Number of Questions
            </label>
            <input
              type="number"
              value={formData.questionCount}
              onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
              min={3}
              max={15}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Settings className="h-4 w-4 text-primary" />
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['beginner', 'intermediate', 'expert'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, difficulty: level as any })}
                className={`px-4 py-2 rounded-lg border ${
                  formData.difficulty === level
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input hover:border-primary/50'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Focus Areas</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {focusAreaOptions.map((area) => (
              <label
                key={area}
                className="flex items-center gap-2 p-2 rounded-lg border border-input hover:border-primary/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.focusAreas.includes(area)}
                  onChange={(e) => {
                    const newAreas = e.target.checked
                      ? [...formData.focusAreas, area]
                      : formData.focusAreas.filter(a => a !== area);
                    setFormData({ ...formData, focusAreas: newAreas });
                  }}
                  className="rounded border-input"
                />
                {area}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Start Interview
        </Button>
      </form>
    </Card>
  );
}