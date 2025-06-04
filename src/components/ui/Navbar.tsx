import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { UserButton, useAuth, SignInButton } from "@clerk/clerk-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 border-border/40 backdrop-blur-sm">
      <div className="container px-4 py-4 mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <motion.div
              className="flex items-center justify-center w-10 h-10 text-white rounded-xl bg-gradient-to-br from-primary to-purple-500"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles size={24} />
            </motion.div>
            <motion.span 
              className="text-xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              InterviewGenie
            </motion.span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-8 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) => cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden",
                isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
              )}
              end
            >
              {({ isActive }) => (
                <>
                  Dashboard
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="navbar-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/questions"
              className={({ isActive }) => cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden",
                isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
              )}
            >
              {({ isActive }) => (
                <>
                  Questions
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="navbar-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/upgrade"
              className={({ isActive }) => cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden",
                isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
              )}
            >
              {({ isActive }) => (
                <>
                  Upgrade
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="navbar-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/how-it-works"
              className={({ isActive }) => cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden",
                isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
              )}
            >
              {({ isActive }) => (
                <>
                  How it Works?
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="navbar-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button 
              onClick={toggleTheme} 
              className="p-2 transition-all duration-300 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            {/* Auth Controls */}
            {isSignedIn ? (
              <UserButton 
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8"
                  }
                }}
              />
            ) : (
              <SignInButton mode="redirect">
                <motion.button
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </SignInButton>
            )}

            {/* Mobile Menu Button */}
            <motion.button 
              className="p-2 transition-colors duration-300 rounded-full md:hidden text-foreground/70 hover:text-foreground hover:bg-accent"
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <motion.div 
          className={cn(
            "md:hidden border-t border-border/40 mt-4 overflow-hidden",
            isMenuOpen ? "block" : "hidden"
          )}
          initial={false}
          animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-4 py-4">
            <NavLink
              to="/"
              className={({ isActive }) => cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
              onClick={() => setIsMenuOpen(false)}
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/questions"
              className={({ isActive }) => cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Questions
            </NavLink>
            <NavLink
              to="/upgrade"
              className={({ isActive }) => cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Upgrade
            </NavLink>
            <NavLink
              to="/how-it-works"
              className={({ isActive }) => cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works?
            </NavLink>
          </div>
        </motion.div>
      </div>
    </header>
  );
}