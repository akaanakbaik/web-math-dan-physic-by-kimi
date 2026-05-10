import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sigma, Atom, HelpCircle, BrainCircuit } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/mathematics', label: 'Math', icon: Sigma },
  { path: '/physics', label: 'Fisika', icon: Atom },
  { path: '/unsolved', label: 'Unsolved', icon: HelpCircle },
  { path: '/ai-assistant', label: 'AI', icon: BrainCircuit },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-glass-border bg-nexus-deep/95 backdrop-blur-xl md:hidden">
      <div className="flex h-full items-center justify-around px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-0.5 h-0.5 w-6 rounded-full bg-nexus-cyan"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
              <Icon
                className={`h-[18px] w-[18px] transition-colors ${
                  isActive ? 'text-nexus-cyan' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-[9px] font-medium transition-colors ${
                  isActive ? 'text-nexus-cyan' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
