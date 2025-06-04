import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { MessageSquare, Monitor, Brain, Award, Zap, Users, Target, Clock } from 'lucide-react';
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

export default function HowItWorks() {
  const steps = [
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Create Your Interview",
      description: "Select the type of interview you want to practice, from technical to behavioral questions."
    },
    {
      icon: <Monitor className="h-10 w-10 text-primary" />,
      title: "Start the Session",
      description: "Join a video session where our AI interviewer will ask you questions based on your selected interview type."
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Get Intelligent Feedback",
      description: "Our AI analyzes your responses and provides detailed, personalized feedback to help you improve."
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Track Your Progress",
      description: "Review your past interviews, see your improvement over time, and focus on areas that need more practice."
    }
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Real-time Analysis",
      description: "Get instant feedback on your responses, body language, and communication style."
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Industry Experts",
      description: "Our AI is trained on feedback from top industry professionals across various fields."
    },
    {
      icon: <Target className="h-6 w-6 text-green-500" />,
      title: "Personalized Practice",
      description: "Focus on areas where you need the most improvement with tailored question sets."
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      title: "Flexible Schedule",
      description: "Practice at your own pace, 24/7, from anywhere in the world."
    }
  ];

  return (
    <motion.div 
      className="space-y-12"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Hero Section */}
      <motion.div variants={item} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Master Your Interview Skills
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Practice with our AI-powered platform and get personalized feedback to improve your interview performance
        </p>
        <Button size="lg" className="mt-6">Start Practicing Now</Button>
      </motion.div>

      {/* How It Works Steps */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">The InterviewGenie Process</CardTitle>
            <CardDescription>Our AI-powered platform makes interview preparation simple and effective</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="relative"
                  variants={item}
                >
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 w-full h-[2px] bg-gradient-to-r from-primary/20 to-transparent -translate-y-1/2 transform" />
                  )}
                  <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                    <div className="p-4 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground mt-2">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={container}
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={item}>
            <Card className="h-full card-hover-effect">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-background">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Ace Your Next Interview?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join thousands of job seekers who have improved their interview skills with InterviewGenie
            </p>
            <Button size="lg" className="mt-4">Get Started for Free</Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}