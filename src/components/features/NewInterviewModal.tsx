import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Briefcase, FileText, Clock, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useUser } from '@clerk/clerk-react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import { genAI } from '../../lib/gemini';

interface NewInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    title: string; 
    jobRole: string; 
    yearsOfExperience: string;
    reasonForInterview: string;
  }) => void;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modal = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const experienceOptions = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-8 years",
  "8+ years"
];

export default function NewInterviewModal({ isOpen, onClose }: NewInterviewModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    jobRole: '',
    yearsOfExperience: '',
    reasonForInterview: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();

  const generateAIResponse = async (prompt: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Validate JSON structure
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.questions)) {
        throw new Error('Invalid AI response format');
      }
      
      return parsed;
    } catch (error) {
      console.error('Error details:', error);
      throw new Error('Failed to generate questions. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const prompt = `Create 5 interview questions with answers for the following position:
        Job Title: ${formData.title}
        Job Role: ${formData.jobRole}
        Experience Level: ${formData.yearsOfExperience}
        Interview Context: ${formData.reasonForInterview}
        
        Format the response as JSON with this structure:
        {
          "questions": [
            {
              "Question": "question text",
              "Answer": "answer text"
            }
          ]
        }`;
      
      const aiResponse = await generateAIResponse(prompt);
      
      const newMockId = uuidv4();
      await db
        .insert(MockInterview)
        .values({
          id: newMockId,
          jobTitle: formData.title,
          jobRole: formData.jobRole,
          yearsOfExperience: formData.yearsOfExperience,
          reasonForInterview: formData.reasonForInterview,
          questions: JSON.stringify(aiResponse),
          createdBy: user?.primaryEmailAddress?.emailAddress || ''
        });
      navigate('/interview/questions', { state: { questions: aiResponse.questions } });
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div 
            className="bg-card rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
                Create New Interview
              </h2>
              <button 
                onClick={onClose}
                className="p-2 transition-colors rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText size={16} className="text-primary" />
                  Interview Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 transition-all duration-200 border rounded-lg border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Frontend Developer Interview"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="jobRole" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Briefcase size={16} className="text-primary" />
                  Job Role
                </label>
                <input
                  type="text"
                  id="jobRole"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 transition-all duration-200 border rounded-lg border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Senior React Developer"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="yearsOfExperience" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock size={16} className="text-primary" />
                  Years of Experience
                </label>
                <select
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 transition-all duration-200 border rounded-lg border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  {experienceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="reasonForInterview" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Award size={16} className="text-primary" />
                  Why are you interviewing?
                </label>
                <select
                  id="reasonForInterview"
                  name="reasonForInterview"
                  value={formData.reasonForInterview}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 transition-all duration-200 border rounded-lg border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select your goal</option>
                  <option value="new-job">Looking for a new job</option>
                  <option value="practice">General practice</option>
                  <option value="upcoming">Preparing for upcoming interview</option>
                  <option value="skills">Improving interview skills</option>
                  <option value="career-switch">Switching career paths</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="button-hover-effect"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.title || !formData.jobRole || !formData.yearsOfExperience || !formData.reasonForInterview || loading}
                  className="button-hover-effect"
                >
                  {loading ? 'Generating...' : 'Start Interview'}
                </Button>
              </div>

              {error && (
                <div className="mt-2 text-sm text-red-500">
                  {error}
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}