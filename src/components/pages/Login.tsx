import { SignIn } from "@clerk/clerk-react";
import { motion } from 'framer-motion';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <SignIn 
          routing="path" 
          path="/sign-in"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "p-8 rounded-lg shadow-lg bg-background border border-input",
              headerTitle: "text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent",
              headerSubtitle: "text-muted-foreground mt-2"
            }
          }}
        />
      </motion.div>
    </div>
  );
}