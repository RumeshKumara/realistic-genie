import { Check } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';

export default function Upgrade() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Get started with basic features",
      features: [
        "5 practice interviews per month",
        "Basic feedback",
        "Limited question bank",
        "Email support",
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$15/month",
      description: "Perfect for serious job seekers",
      features: [
        "Unlimited practice interviews",
        "Detailed AI feedback",
        "Full question library",
        "Custom interview scenarios",
        "Priority support",
        "Interview recording & analysis",
      ],
      buttonText: "Upgrade Now",
      buttonVariant: "default" as const,
      highlighted: true,
    },
    {
      name: "Teams",
      price: "$49/month",
      description: "For companies and career coaches",
      features: [
        "Everything in Pro",
        "Up to 5 team members",
        "Team analytics dashboard",
        "Customizable question sets",
        "Branded experience",
        "Dedicated account manager",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      highlighted: false,
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upgrade Your Plan</h1>
        <p className="mt-1 text-muted-foreground">Choose the plan that works best for your interview preparation needs</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-300 ${
              plan.highlighted 
                ? 'border-primary shadow-lg relative overflow-hidden' 
                : ''
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 right-0">
                <div className="px-3 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-bl-md">
                  POPULAR
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.name !== "Free" && (
                  <span className="ml-1 text-muted-foreground">per month</span>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant={plan.buttonVariant} 
                className={`w-full ${plan.highlighted ? 'bg-primary text-white' : ''}`}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-sm text-center text-muted-foreground">
        All plans include a 14-day free trial. No credit card required.
      </div>
    </div>
  );
}