import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Sigma,
  Atom,
  HelpCircle,
  BrainCircuit,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { path: '/', label: 'Beranda', icon: Home },
  { path: '/mathematics', label: 'Matematika', icon: Sigma },
  { path: '/physics', label: 'Fisika', icon: Atom },
  { path: '/unsolved', label: 'Belum Terpecahkan', icon: HelpCircle },
  { path: '/ai-assistant', label: 'AI Asisten', icon: BrainCircuit },
];

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, isMobile } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      {(sidebarOpen || !isMobile) && (
        <motion.aside
          initial={isMobile ? { x: '-100%' } : { x: 0 }}
          animate={{ x: 0 }}
          exit={isMobile ? { x: '-100%' } : { x: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed left-0 top-14 z-30 h-[calc(100dvh-3.5rem)] w-64 border-r border-glass-border bg-nexus-deep/90 backdrop-blur-xl ${
            isMobile ? 'block' : 'hidden md:block'
          }`}
        >
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/5 text-nexus-cyan'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-nexus-cyan"
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    />
                  )}
                  <Icon className={`h-4 w-4 ${isActive ? 'text-nexus-cyan' : ''}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-3 w-3 text-nexus-cyan" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-glass-border p-3">
            <div className="rounded-lg bg-white/[0.02] p-2.5">
              <p className="text-[10px] font-mono text-muted-foreground">
                v1.0.0 · PhD Level
              </p>
              <p className="mt-0.5 text-[10px] font-mono text-nexus-cyan/60">
                120fps · AI Powered
              </p>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
